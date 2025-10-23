from flask import Blueprint, request, jsonify
from app.models.property import Property
from app import db

properties_bp = Blueprint("properties", __name__)

@properties_bp.route("", methods=["POST"])
def create_property():
    data = request.get_json()
    
    if not data.get("name") or not data.get("location"):
        return jsonify({"error": "Name and location are required"}), 400
    
    new_property = Property(
        name=data["name"],
        location=data["location"],
        date_added=data.get("date_added")
    )

    db.session.add(new_property)
    db.session.commit()

    return jsonify(new_property.to_dict()), 201

@properties_bp.route("/test", methods=["GET"])
def test_properties():
    return jsonify({"message": "Properties route working!"}), 200
