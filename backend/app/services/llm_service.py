from __future__ import annotations
import logging
import httpx

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(
        self,
        model: str,
        base_url: str,
    ) -> None:
        self.model = model
        self.base_url = base_url.rstrip("/")
        
        logger.info("Active Provider: Ollama")
        logger.info(f"Active Model: {self.model}")

    def chat_completion(
        self,
        messages: list[dict[str, str]],
        temperature: float = 0.0,
        timeout: float = 30.0,
    ) -> str | None:
        try:
            resp = httpx.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "temperature": temperature,
                    "messages": messages,
                },
                timeout=httpx.Timeout(timeout, connect=3.0),
            )
            resp.raise_for_status()
            logger.debug("Successfully used Ollama API for chat completion.")
            return resp.json()["choices"][0]["message"]["content"]
        except httpx.ConnectError as e:
            logger.error(f"Connection refused. Ensure Ollama is running at {self.base_url} ({e})")
        except httpx.TimeoutException as e:
            logger.error(f"Timeout connecting to Ollama. The model might be loading or the server is slow ({e})")
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                logger.error(f"Model '{self.model}' not installed in Ollama. Run: ollama run {self.model}")
            else:
                logger.error(f"Ollama HTTP error {e.response.status_code}: {e.response.text}")
        except Exception as e:
            logger.error(f"Ollama API failed unexpectedly ({e}).")

        return None
