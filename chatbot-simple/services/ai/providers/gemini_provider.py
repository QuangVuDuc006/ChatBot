import base64

import google.generativeai as genai

from services.ai.errors import (
    APIResponseFormatError,
    APITimeoutError,
    InvalidModelError,
    RateLimitError,
    UpstreamAPIError,
)
from services.ai.providers.base import AIProvider, build_user_content, split_attachments


class GeminiProvider(AIProvider):
    def configure(self):
        self.ensure_configured()
        genai.configure(api_key=self.config.api_key)

    def normalize_model_name(self, name):
        name = (name or "").strip()

        if name.startswith("models/"):
            return name.replace("models/", "", 1)

        return name

    def available_models(self):
        if not self.config.api_key:
            return super().available_models()

        try:
            self.configure()
            models = [
                self.normalize_model_name(model.name)
                for model in genai.list_models()
                if "generateContent" in getattr(model, "supported_generation_methods", [])
            ]
            return models or super().available_models()
        except Exception:
            return super().available_models()

    def resolve_model(self, requested_model=None):
        self.configure()
        model = self.normalize_model_name(super().resolve_model(requested_model))
        available_models = self.available_models()

        if requested_model and available_models and model not in available_models:
            raise InvalidModelError(
                f"Model '{model}' is not available for Gemini generateContent.",
                provider=self.provider_id,
                model=model,
            )

        return model

    def generate_reply(self, message, model, attachments):
        try:
            content = self.build_gemini_content(message, attachments)
            response = genai.GenerativeModel(model).generate_content(content)
            reply = getattr(response, "text", "").strip()

            if not reply:
                raise APIResponseFormatError(
                    "Gemini did not return a response.",
                    provider=self.provider_id,
                    model=model,
                )

            return reply
        except (APIResponseFormatError, InvalidModelError):
            raise
        except Exception as error:
            raise self.wrap_gemini_error(error, model) from error

    def stream_reply(self, message, model, attachments):
        try:
            content = self.build_gemini_content(message, attachments)

            for chunk in genai.GenerativeModel(model).generate_content(content, stream=True):
                text = getattr(chunk, "text", "")

                if text:
                    yield text
        except Exception as error:
            raise self.wrap_gemini_error(error, model) from error

    def supports_images(self, model=None):
        if self.config.supports_images_override is not None:
            return self.config.supports_images_override

        normalized_model = self.normalize_model_name(model or self.default_model).lower()
        return normalized_model.startswith("gemini-") and "tts" not in normalized_model

    def build_gemini_content(self, message, attachments):
        text_content = build_user_content(message, attachments)
        _text_attachments, image_attachments = split_attachments(attachments)

        if not image_attachments:
            return text_content

        parts = [text_content]

        for attachment in image_attachments:
            _header, encoded_data = attachment["data_url"].split(";base64,", 1)
            parts.append({
                "mime_type": attachment["mime_type"],
                "data": base64.b64decode(encoded_data),
            })

        return parts

    def wrap_gemini_error(self, error, model):
        message = str(error) or error.__class__.__name__
        lower_message = message.lower()

        if "quota" in lower_message or "rate" in lower_message or "429" in lower_message:
            return RateLimitError(
                "Gemini rate limit reached. Please try again later.",
                provider=self.provider_id,
                model=model,
                details=message,
            )

        if "timeout" in lower_message or "deadline" in lower_message:
            return APITimeoutError(
                "Gemini request timed out. Please try again.",
                provider=self.provider_id,
                model=model,
                details=message,
            )

        if "model" in lower_message and ("not found" in lower_message or "invalid" in lower_message):
            return InvalidModelError(
                f"Invalid Gemini model '{model}'.",
                provider=self.provider_id,
                model=model,
                details=message,
            )

        return UpstreamAPIError(
            "Gemini request failed.",
            provider=self.provider_id,
            model=model,
            details=message,
        )
