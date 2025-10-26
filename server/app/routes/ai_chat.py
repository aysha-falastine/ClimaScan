from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.climate_api_service import get_ai_response

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    try:
        data = request.get_json() or {}
        message = data.get('message')
        history = data.get('history', [])

        if not message:
            return jsonify({
                "success": False,
                "error": "Message is required"
            }), 400

        # Format conversation history (if provided)
        formatted_history = [
            {"role": h.get("role", "user"), "content": h.get("content", "")}
            for h in history
        ]

        # Call AI response service
        reply = get_ai_response(message, formatted_history)

        return jsonify({
            "success": True,
            "data": {"response": reply}
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
