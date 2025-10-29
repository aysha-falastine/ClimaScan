from flask import Blueprint, jsonify, request
from app.services.ai_chat_service import get_chat_service

# Exported blueprint variable expected by register_blueprints: ai_bp
ai_bp = Blueprint('ai', __name__)


@ai_bp.route('/chat', methods=['POST'])
def ai_chat():
    """Handle AI chat messages"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        message = data.get('message', '').strip()
        history = data.get('history', [])
        
        if not message:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400
        
        # Get AI response using Hugging Face
        chat_service = get_chat_service()
        response_data = chat_service.get_response(message, history)
        
        return jsonify({
            'success': True,
            'data': response_data
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500