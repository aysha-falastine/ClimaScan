
import os
import requests

class HuggingFaceChatService:
    def _init_(self):
        self.api_key = os.getenv("HUGGINGFACE_API_KEY")
        self.api_url = "https://api-inference.huggingface.co/models/google/gemma-7b"
        self.headers = {"Authorization": f"Bearer {self.api_key}"}

    def get_response(self, message, history):
        """Send message to Hugging Face model and get response"""
        try:
            prompt = self._build_prompt(message, history)
            payload = {"inputs": prompt}
            
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=60)
            response.raise_for_status()
            
            data = response.json()
            # Handle both plain text and structured outputs
            if isinstance(data, list) and "generated_text" in data[0]:
                reply = data[0]["generated_text"].strip()
            elif isinstance(data, dict) and "generated_text" in data:
                reply = data["generated_text"].strip()
            else:
                reply = str(data)
            
            return {"reply": reply}
        
        except Exception as e:
            print(f"Error in HuggingFaceChatService.get_response: {e}")
            return {"reply": f"Sorry, there was an issue connecting to the AI: {e}"}
    
    def _build_prompt(self, message, history):
        """Combine previous chat history with new message"""
        history_text = "\n".join([f"User: {h['user']}\nAI: {h['ai']}" for h in history])
        return f"{history_text}\nUser: {message}\nAI:"

def get_chat_service():
    """Return the Hugging Face chat service"""
    return HuggingFaceChatService()