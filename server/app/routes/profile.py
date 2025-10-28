from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.database.db import db
from werkzeug.security import generate_password_hash

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/me', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'defaultLocation': getattr(user, 'default_location', 'Nairobi'),
        'defaultMapView': getattr(user, 'default_map_view', 'Satellite')
    }), 200

@profile_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    try:
        # Update name
        if 'name' in data:
            user.name = data['name']
        
        # Update email
        if 'email' in data:
            # Check if email already exists
            existing = User.query.filter(User.email == data['email'], User.id != user_id).first()
            if existing:
                return jsonify({'error': 'Email already in use'}), 400
            user.email = data['email']
        
        # Update password
        if 'password' in data and data['password']:
            user.password_hash = generate_password_hash(data['password'])
        
        # Update preferences
        if 'defaultLocation' in data:
            user.default_location = data['defaultLocation']
        
        if 'defaultMapView' in data:
            user.default_map_view = data['defaultMapView']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'defaultLocation': user.default_location,
                'defaultMapView': user.default_map_view
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@profile_bp.route('/me', methods=['DELETE'])
@jwt_required()
def delete_profile():
    """Delete user account"""
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Account deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500