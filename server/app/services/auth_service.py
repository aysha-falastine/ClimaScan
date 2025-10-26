from app.models.user import User
from app.database.db import db

def update_user_profile(user_id, data):
    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    if "password" in data:
        user.set_password(data["password"])  # assumes hashed password method

    user.default_location = data.get("defaultLocation", user.default_location)
    user.default_map_view = data.get("defaultMapView", user.default_map_view)

    db.session.commit()
    return user.to_dict()
