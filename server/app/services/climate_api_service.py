from app.services.ai_chat_service import get_chat_service as _get_chat_service
from app.services.ai_service import HuggingFaceService

_REPORT_AI = None


def _get_report_ai():
    global _REPORT_AI
    if _REPORT_AI is None:
        try:
            _REPORT_AI = HuggingFaceService()
        except Exception:
            _REPORT_AI = None
    return _REPORT_AI


def get_ai_response(message, history=None, property_data=None):
    """Handles chat AI for climate-related questions."""
    chat_service = _get_chat_service()
    response = chat_service.get_response(message, history, property_data)
    return response.get("reply", "Error generating AI response.")


def generate_ai_report(property_data):
    """Handles full climate report generation, with graceful fallback.

    Returns a dict: { 'ai_summary': str, 'source': 'hf'|'fallback' }
    """
    report_ai = _get_report_ai()
    if not report_ai:
        # return offline fallback from ai_service
        from app.services.ai_service import HuggingFaceService as _HF

        return {"ai_summary": _HF()._generate_fallback_report(property_data), "source": "fallback"}

    try:
        result = report_ai.generate_climate_report(property_data)
        # If the service returned a structured result, try to extract text
        if isinstance(result, str):
            return {"ai_summary": result, "source": "hf"}
        try:
            # InferenceClient returns dict-like objects; try to extract generated text
            if isinstance(result, dict) and "generated_text" in result:
                return {"ai_summary": result.get("generated_text"), "source": "hf"}
            if isinstance(result, list) and result and isinstance(result[0], dict) and "generated_text" in result[0]:
                return {"ai_summary": result[0].get("generated_text"), "source": "hf"}
        except Exception:
            pass
        # Fallback to stringifying the result
        return {"ai_summary": str(result), "source": "hf"}
    except Exception:
        # On any failure, return the safe fallback
        return {"ai_summary": report_ai._generate_fallback_report(property_data), "source": "fallback"}
