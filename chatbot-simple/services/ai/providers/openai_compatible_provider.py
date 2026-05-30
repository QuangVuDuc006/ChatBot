import json
import socket
import urllib.error
import urllib.request

from services.ai.errors import (
    APIResponseFormatError,
    APITimeoutError,
    InvalidModelError,
    RateLimitError,
    UpstreamAPIError,
)
from services.ai.providers.base import AIProvider, build_user_content, split_attachments


class OpenAICompatibleProvider(AIProvider):
    def resolve_model(self, requested_model=None):
        self.ensure_configured()
        return super().resolve_model(requested_model)

    def generate_reply(self, message, model, attachments):
        user_content = build_user_content(message, attachments)
        _text_attachments, image_attachments = split_attachments(attachments)
        message_content = user_content

        if image_attachments:
            message_content = [{"type": "text", "text": user_content}]

            for attachment in image_attachments:
                message_content.append({
                    "type": "image_url",
                    "image_url": {
                        "url": attachment["data_url"],
                    },
                })

        body = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": message_content,
                },
            ],
        }
        data = self.post_chat_completions(body, model)

        try:
            reply = data["choices"][0]["message"]["content"].strip()
        except (KeyError, IndexError, TypeError, AttributeError) as error:
            raise APIResponseFormatError(
                "AI API response format did not match choices[0].message.content.",
                provider=self.provider_id,
                model=model,
            ) from error

        if not reply:
            raise APIResponseFormatError(
                "AI API returned an empty response.",
                provider=self.provider_id,
                model=model,
            )

        return reply

    def stream_reply(self, message, model, attachments):
        yield self.generate_reply(message, model, attachments)

    def supports_images(self, model=None):
        if self.config.supports_images_override is not None:
            return self.config.supports_images_override

        normalized_model = (model or self.default_model or "").lower()

        if normalized_model in {item.lower() for item in self.config.image_models}:
            return True

        vision_markers = (
            "vision",
            "gpt-4o",
            "gpt-4.1",
            "gpt-5",
            "o3",
            "o4",
            "claude-3",
            "claude-4",
            "gemini",
        )
        return any(marker in normalized_model for marker in vision_markers)

    def post_chat_completions(self, body, model):
        endpoint = f"{self.config.base_url.rstrip('/')}/chat/completions"
        payload = json.dumps(body).encode("utf-8")
        request = urllib.request.Request(
            endpoint,
            data=payload,
            headers={
                "Authorization": f"Bearer {self.config.api_key}",
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "ChatbotSimple/1.0",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=self.config.timeout_seconds) as response:
                response_body = response.read().decode("utf-8")
        except urllib.error.HTTPError as error:
            raise self.wrap_http_error(error, model) from error
        except (TimeoutError, socket.timeout) as error:
            raise APITimeoutError(
                "AI API request timed out. Please try again.",
                provider=self.provider_id,
                model=model,
            ) from error
        except urllib.error.URLError as error:
            reason = str(getattr(error, "reason", error))
            if "timed out" in reason.lower():
                raise APITimeoutError(
                    "AI API request timed out. Please try again.",
                    provider=self.provider_id,
                    model=model,
                    details=reason,
                ) from error

            raise UpstreamAPIError(
                "Could not connect to AI API.",
                provider=self.provider_id,
                model=model,
                details=reason,
            ) from error

        try:
            return json.loads(response_body)
        except json.JSONDecodeError as error:
            raise APIResponseFormatError(
                "AI API returned invalid JSON.",
                provider=self.provider_id,
                model=model,
            ) from error

    def wrap_http_error(self, error, model):
        try:
            body = error.read().decode("utf-8")
        except Exception:
            body = ""

        details = self.compact_error_body(body) or error.reason

        if error.code == 429:
            return RateLimitError(
                "AI API rate limit reached. Please try again later.",
                provider=self.provider_id,
                model=model,
                details=details,
            )

        if error.code == 401:
            return UpstreamAPIError(
                f"Provider rejected the API key: {details}",
                provider=self.provider_id,
                model=model,
                details=details,
            )

        if error.code == 403 and self.is_cloudflare_access_denied(details):
            return UpstreamAPIError(
                "The configured API endpoint is blocked by Cloudflare. Check that CUSTOM_BASE_URL points to the provider's OpenAI-compatible API endpoint, not the website or management API.",
                provider=self.provider_id,
                model=model,
                details=details,
            )

        if error.code == 403:
            return UpstreamAPIError(
                f"Provider denied the request: {details}",
                provider=self.provider_id,
                model=model,
                details=details,
            )

        if error.code in (408, 504):
            return APITimeoutError(
                "AI API request timed out. Please try again.",
                provider=self.provider_id,
                model=model,
                details=details,
            )

        if error.code == 400 and "model" in str(details).lower():
            return InvalidModelError(
                f"Invalid model '{model}' for provider '{self.provider_id}'.",
                provider=self.provider_id,
                model=model,
                details=details,
            )

        return UpstreamAPIError(
            f"AI API request failed with status {error.code}.",
            provider=self.provider_id,
            model=model,
            details=details,
        )

    def is_cloudflare_access_denied(self, details):
        details = str(details).lower()
        return "cloudflare" in details or "error 1010" in details or "browser_signature_banned" in details

    def compact_error_body(self, body):
        if not body:
            return ""

        try:
            payload = json.loads(body)
            message = payload.get("error", {}).get("message") if isinstance(payload.get("error"), dict) else payload.get("error")
            return str(message or payload)[:500]
        except (json.JSONDecodeError, AttributeError):
            return body[:500]
