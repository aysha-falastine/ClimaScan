from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.property import Property
from app.database.db import db
from datetime import datetime

properties_bp = Blueprint("properties", __name__, url_prefix="/api/properties")

@properties_bp.route("", methods=["GET"])
@jwt_required()
def get_properties():
    
    print("🔍 Incoming headers:", dict(request.headers))

    user_id = int(get_jwt_identity())
    search = request.args.get("search", "").strip()
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 5))

    query = Property.query.filter_by(user_id=user_id)

    if search:
        query = query.filter(Property.name.ilike(f"%{search}%"))

    pagination = query.order_by(Property.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "properties": [p.to_dict() for p in pagination.items],
        "page": pagination.page,
        "pages": pagination.pages,
        "total": pagination.total
    })


@properties_bp.route("", methods=["POST"])
@jwt_required()
def create_property():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    prop = Property(
        user_id=user_id,
        name=data.get("name"),
        location=data.get("location"),
        date_added=datetime.strptime(data.get("date_added"), "%Y-%m-%d")
        if data.get("date_added") else None
    )
    db.session.add(prop)
    db.session.commit()
    return jsonify(prop.to_dict()), 201


@properties_bp.route("/<int:property_id>", methods=["PUT"])
@jwt_required()
def update_property(property_id):
    user_id = int(get_jwt_identity())
    prop = Property.query.filter_by(id=property_id, user_id=user_id).first_or_404()
    data = request.get_json()
    prop.name = data.get("name", prop.name)
    prop.location = data.get("location", prop.location)
    prop.date_added = datetime.strptime(data.get("date_added"), "%Y-%m-%d") \
        if data.get("date_added") else prop.date_added
    db.session.commit()
    return jsonify(prop.to_dict())


@properties_bp.route("/<int:property_id>", methods=["DELETE"])
@jwt_required()
def delete_property(property_id):
    user_id = int(get_jwt_identity())
    prop = Property.query.filter_by(id=property_id, user_id=user_id).first_or_404()
    db.session.delete(prop)
    db.session.commit()
    return jsonify({"message": "Property deleted"})
