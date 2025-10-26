import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def get_ai_response(message, history=None):
    messages = [{"role": "system", "content": "You are a helpful climate assistant."}]
    if history:
        messages += history
    messages.append({"role": "user", "content": message})

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7
        )
        return response.choices[0].message["content"]
    except Exception as e:
        print("OpenAI error:", e)
        return "Sorry, I couldn't process that request."
