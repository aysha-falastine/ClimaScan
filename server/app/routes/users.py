from flask import Blueprint, request, jsonify

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['GET'])
def get_profile():
    return jsonify({
        "id": 1,
        "name": "julius",
        "email": "juliuskedienye61@gmail.com",
        "default_location": "Nairobi",
        "default_map_view": "Satellite"
    })

@users_bp.route('/me', methods=['PUT'])
def update_profile():
    data = request.get_json()
    return jsonify({
        "id": 1,
        "name": data.get("name"),
        "email": data.get("email"),
        "default_location": data.get("defaultLocation"),
        "default_map_view": data.get("defaultMapView"),
        "message": "Profile updated successfully"
    })