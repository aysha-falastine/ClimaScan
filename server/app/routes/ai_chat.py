from flask import Blueprint, jsonify, request
from app.services.ai_chat_service import get_chat_service

ai_chat_bp = Blueprint('ai_chat', __name__)

@ai_chat_bp.route('/ai/chat', methods=['POST', 'OPTIONS'])
def ai_chat():
    """Handle AI chat messages"""
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200

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
        print(f"Error in ai_chat endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500