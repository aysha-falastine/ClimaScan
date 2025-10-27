from flask import Blueprint, request, jsonify
from app.database.db import db
from app.models.user import User
from app.middleware.auth_middleware import token_required
from werkzeug.security import generate_password_hash

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

@users_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current user profile"""
    try:
        # Get preferences from JSON field
        preferences = current_user.preferences or {}
        
        return jsonify({
            'success': True,
            'user': {
                'id': current_user.id,
                'name': current_user.name,
                'email': current_user.email,
                'default_location': preferences.get('default_location', 'Kenya'),
                'default_map_view': preferences.get('default_map_view', 'Street'),
                'created_at': current_user.created_at.isoformat() if current_user.created_at else None
            }
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching user: {str(e)}'
        }), 500

@users_bp.route('/me', methods=['PUT'])
@token_required
def update_current_user(current_user):
    """Update current user profile"""
    try:
        data = request.get_json()
        
        # Update name if provided
        if 'name' in data:
            current_user.name = data['name']
        
        # Update email if provided
        if 'email' in data:
            # Check if email is already taken by another user
            existing_user = User.query.filter(
                User.email == data['email'],
                User.id != current_user.id
            ).first()
            
            if existing_user:
                return jsonify({
                    'success': False,
                    'message': 'Email already in use by another account'
                }), 400
            
            current_user.email = data['email']
        
        # Update password if provided
        if 'password' in data and data['password']:
            # Validate password length
            if len(data['password']) < 6:
                return jsonify({
                    'success': False,
                    'message': 'Password must be at least 6 characters long'
                }), 400
            
            current_user.set_password(data['password'])
        
        # Update preferences (stored as JSON)
        preferences = current_user.preferences or {}
        
        if 'default_location' in data:
            preferences['default_location'] = data['default_location']
        
        if 'default_map_view' in data:
            preferences['default_map_view'] = data['default_map_view']
        
        # Save updated preferences
        current_user.preferences = preferences
        
        # Mark updated_at
        from datetime import datetime
        current_user.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'user': {
                'id': current_user.id,
                'name': current_user.name,
                'email': current_user.email,
                'default_location': preferences.get('default_location'),
                'default_map_view': preferences.get('default_map_view')
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error updating profile: {str(e)}'
        }), 500

@users_bp.route('/me', methods=['DELETE'])
@token_required
def delete_current_user(current_user):
    """Delete current user account"""
    try:
        # Delete user (cascade will delete related records)
        db.session.delete(current_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Account deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error deleting account: {str(e)}'
        }), 500