from services.ai.providers.openai_compatible_provider import OpenAICompatibleProvider
from services.ai.errors import MissingProviderConfigError


class CustomProvider(OpenAICompatibleProvider):
    """Default custom provider hook.

    This implementation targets OpenAI-compatible APIs. If a third-party API has
    a different request or response shape, override generate_reply here while
    keeping the same normalized provider interface.
    """

    def resolve_model(self, requested_model=None):
        self.ensure_chiasegpu_chat_endpoint()
        return super().resolve_model(requested_model)

    def ensure_chiasegpu_chat_endpoint(self):
        base_url = (self.config.base_url or "").rstrip("/").lower()

        if "chiasegpu.vn" not in base_url:
            return

        if base_url.endswith("/v1") or "/v1/" in base_url:
            return

        raise MissingProviderConfigError(
            "ChiaseGPU API v2 is a management API and does not expose chat completions. Set CUSTOM_BASE_URL to ChiaseGPU's OpenAI-compatible LLM endpoint, usually ending in /v1, and use an LLM key for CUSTOM_API_KEY.",
            provider=self.provider_id,
            model=self.config.default_model,
        )
