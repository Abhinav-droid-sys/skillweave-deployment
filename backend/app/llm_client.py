from __future__ import annotations
import logging
from .config import settings
from .services.llm_service import LLMService

logger = logging.getLogger(__name__)

class LLMClient:
    """
    Compatibility wrapper around LLMService.
    Preserves backward compatibility for existing imports until fully migrated.
    """
    def __init__(self, *args, **kwargs) -> None:
        self.service = LLMService(
            model=settings.local_model_name,
            base_url=settings.ollama_base_url
        )
        logger.info(f"Initialized LLMClient compatibility wrapper around LLMService with local model {settings.local_model_name}")

    def chat_completion(
        self,
        messages: list[dict[str, str]],
        temperature: float = 0.0,
        timeout: float = 30.0,
    ) -> str | None:
        return self.service.chat_completion(
            messages=messages,
            temperature=temperature,
            timeout=timeout,
        )
