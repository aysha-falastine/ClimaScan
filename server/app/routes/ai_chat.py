from flask import Blueprint, request, jsonify

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json() or {}
        message = data.get('message', '')
        
        # Mock response for testing
        response_text = f"You asked: {message}. This is a test response. OpenAI integration coming soon!"
        
        return jsonify({
            "success": True,
            "data": {"response": response_text}
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500