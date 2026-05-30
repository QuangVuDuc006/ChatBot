from dataclasses import dataclass

from services.ai.config import get_default_provider_id, get_provider_configs
from services.ai.errors import InvalidProviderError
from services.ai.providers.base import AIResponse
from services.ai.providers.custom_provider import CustomProvider
from services.ai.providers.gemini_provider import GeminiProvider
from services.ai.providers.openai_compatible_provider import OpenAICompatibleProvider


@dataclass(frozen=True)
class AIStream:
    provider: str
    model: str
    chunks: object


class ProviderRouter:
    def __init__(self):
        configs = get_provider_configs()
        self.providers = {
            "gemini": GeminiProvider(configs["gemini"]),
            "openai": OpenAICompatibleProvider(configs["openai"]),
            "openrouter": OpenAICompatibleProvider(configs["openrouter"]),
            "custom": CustomProvider(configs["custom"]),
        }

    def default_provider_id(self):
        configured_default = get_default_provider_id()

        if configured_default in self.providers:
            return configured_default

        return next(iter(self.providers))

    def get_provider(self, provider_id=None):
        selected_provider = (provider_id or self.default_provider_id()).strip().lower()
        provider = self.providers.get(selected_provider)

        if not provider:
            raise InvalidProviderError(
                f"Invalid provider '{selected_provider}'.",
                provider=selected_provider,
            )

        return provider

    def list_provider_options(self, provider_id=None):
        active_provider = self.get_provider(provider_id)
        providers = []

        for provider in self.providers.values():
            models = provider.available_models()
            default_model = provider.default_model
            providers.append({
                "id": provider.provider_id,
                "label": provider.label,
                "models": models,
                "default_model": default_model,
                "configured": provider.is_configured(),
                "supports_images": provider.supports_images(default_model),
            })

        return {
            "providers": providers,
            "active_provider": active_provider.provider_id,
            "models": active_provider.available_models(),
            "active": active_provider.default_model,
            "default": active_provider.default_model,
            "supports_images": active_provider.supports_images(active_provider.default_model),
        }

    def generate(self, provider_id, message, model=None, attachments=None):
        provider = self.get_provider(provider_id)
        active_model = provider.resolve_model(model)
        provider.ensure_supports_attachments(active_model, attachments or [])
        reply = provider.generate_reply(message, active_model, attachments or [])
        return AIResponse(reply=reply, provider=provider.provider_id, model=active_model)

    def prepare_stream(self, provider_id, message, model=None, attachments=None):
        provider = self.get_provider(provider_id)
        active_model = provider.resolve_model(model)
        provider.ensure_supports_attachments(active_model, attachments or [])
        chunks = provider.stream_reply(message, active_model, attachments or [])
        return AIStream(provider=provider.provider_id, model=active_model, chunks=chunks)
