import os
import requests


class HuggingFaceChatService:
    """Handles conversational AI responses via Hugging Face API."""

    def __init__(self):
        # Support both HF_API_KEY and HUGGINGFACE_API_KEY environment variable names
        self.api_key = os.getenv("HF_API_KEY") or os.getenv("HUGGINGFACE_API_KEY")
        self.model_id = os.getenv("HF_MODEL_ID", "mistralai/Mistral-7B-Instruct-v0.2")
        self.api_url = f"https://api-inference.huggingface.co/models/{self.model_id}"
        self.headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}

    def get_response(self, message, history=None, property_data=None):
        """Return chat-style response from Hugging Face model."""
        if not self.api_key:
            return {"reply": "Missing Hugging Face API key. Please set HF_API_KEY or HUGGINGFACE_API_KEY."}

        try:
            prompt = self._build_prompt(message, history, property_data)
            payload = {"inputs": prompt}
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=60)
            response.raise_for_status()
            data = response.json()

            # Hugging Face inference endpoints return varying shapes depending on model
            if isinstance(data, list) and data and isinstance(data[0], dict) and "generated_text" in data[0]:
                reply = data[0]["generated_text"].strip()
            elif isinstance(data, dict) and "generated_text" in data:
                reply = data["generated_text"].strip()
            else:
                # Fallback: stringify returned object
                reply = str(data)

            return {"reply": reply, "source": "hf"}
        except Exception as e:
            # Return a helpful fallback message instead of raw exception text
            prop_part = ""
            if property_data:
                prop_part = f" for {property_data.get('name')} in {property_data.get('location', '')}"

            fallback = (
                f"AI service currently unavailable{prop_part}. "
                "Here's a short fallback summary: Climate vulnerability is moderate — check drainage and heat mitigation measures."
            )
            return {"reply": fallback, "source": "fallback"}

    def _build_prompt(self, message, history=None, property_data=None):
        """Build a context-aware prompt."""
        history_text = ""
        if history:
            history_text = "\n".join([f"User: {h.get('user')}\nAI: {h.get('ai')}" for h in history[-5:]])

        property_context = ""
        if property_data:
            property_context = f"\nProperty: {property_data.get('name')} at {property_data.get('location', property_data.get('address'))}"

        return f"""You are ClimaScan AI, a climate risk assistant for Kenyan properties.
{property_context}
{history_text}
User: {message}
AI:"""


# Simple factory for the chat service (singleton)
_CHAT_SERVICE = None


def get_chat_service():
    global _CHAT_SERVICE
    if _CHAT_SERVICE is None:
        _CHAT_SERVICE = HuggingFaceChatService()
    return _CHAT_SERVICE
