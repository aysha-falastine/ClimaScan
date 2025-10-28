from flask import Blueprint, request, jsonify
from app.database.db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
import re

users_bp = Blueprint('users', __name__)

# Helper functions
def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

def is_strong_password(password):
    return (
        len(password) >= 8
        and any(c.isupper() for c in password)
        and any(c.islower() for c in password)
        and any(c.isdigit() for c in password)
    )

@users_bp.errorhandler(Exception)
def handle_exception(e):
    return jsonify({'error': str(e)}), 500


# ✅ Signup route
@users_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({'error': 'Invalid JSON data'}), 400

        email = data.get('email')
        password = data.get('password')
        name = data.get('name', '')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        if not name:
            return jsonify({'error': 'Name is required'}), 400

        if not is_valid_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        if not is_strong_password(password):
            return jsonify({'error': 'Weak password. Must include upper, lower, and digit.'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'User already exists'}), 400

        hashed_password = generate_password_hash(password)
        new_user = User(email=email, password_hash=hashed_password, name=name)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ✅ Login route
@users_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({'error': 'Invalid JSON data'}), 400

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid email or password'}), 401

        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'access_token': access_token,
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'name': user.name or 'User',
                'email': user.email
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ✅ Profile route
@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    try:
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'email': user.email}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
