from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.services.auth_services import register_user, authenticate_user

bp = Blueprint('auth', __name__)

@bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = register_user(email, password)
    if not user:
        return jsonify({'error': 'Email already exists'}), 400

    return jsonify({'message': 'User created successfully'}), 201

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = authenticate_user(email, password)
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    token = create_access_token(identity=user.id)
    return jsonify({'token': token}), 200
