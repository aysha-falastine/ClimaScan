from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    return jsonify({'message': 'Login endpoint'}), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    return jsonify({'message': 'Register endpoint'}), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logout endpoint'}), 200