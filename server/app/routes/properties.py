from flask import Blueprint, request, jsonify
from app.models.property import Property
from app import db
from datetime import datetime

properties_bp = Blueprint("properties_bp", __name__)

# Test route
@properties_bp.route("/test", methods=["GET"])
def test_properties():
    return jsonify({"message": "Properties route working!"})

# ------------------------
# CREATE new property
# ------------------------
@properties_bp.route("/", methods=["POST"])
def create_property():
    data = request.get_json()
    if not data or not data.get("name") or not data.get("location"):
        return jsonify({"error": "Name and location are required"}), 400

    date_str = data.get("date_added")

    if date_str:
        try:
            date_added = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400
    else:
        date_added = datetime.now().date()
        
    new_property = Property(
        name=data["name"],
        location=data["location"],
        date_added=date_added
    )

    db.session.add(new_property)
    db.session.commit()

    return jsonify(new_property.to_dict()), 201


# ------------------------
# READ all properties (GET)
# ------------------------
@properties_bp.route("/", methods=["GET"])
def get_properties():
    search = request.args.get("search", "", type=str)
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 5, type=int)

    query = Property.query
    if search:
        query = query.filter(Property.name.ilike(f"%{search}%"))

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    properties = [prop.to_dict() for prop in pagination.items]

    return jsonify({
        "properties": properties,
        "total": pagination.total,
        "page": pagination.page,
        "pages": pagination.pages
    })


# ------------------------
# READ single property
# ------------------------
@properties_bp.route("/<int:id>", methods=["GET"])
def get_property(id):
    prop = Property.query.get_or_404(id)
    return jsonify(prop.to_dict())


# ------------------------
# UPDATE property
# ------------------------
@properties_bp.route("/<int:id>", methods=["PUT"])
def update_property(id):
    prop = Property.query.get_or_404(id)
    data = request.get_json()

    prop.name = data.get("name", prop.name)
    prop.location = data.get("location", prop.location)

    date_str = data.get("date_added")
    if date_str:
        try:
            prop.date_added = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Invalid date format, use YYYY-MM-DD"}), 400

    db.session.commit()
    return jsonify(prop.to_dict()), 200


# ------------------------
# DELETE property
# ------------------------
@properties_bp.route("/<int:id>", methods=["DELETE"])
def delete_property(id):
    prop = Property.query.get_or_404(id)
    db.session.delete(prop)
    db.session.commit()
    return jsonify({"message": f"Property {id} deleted successfully"}), 200
