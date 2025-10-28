from app.models.user import User
from app.database.db import db
def update_user_profile(user_id, data):
    user = User.query.get(user_id)
    if not user:
        return {"error": "User not found"}

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    if "password" in data and data["password"]:
        user.set_password(data["password"])  # assumes hashed password method

    user.default_location = data.get("defaultLocation", user.default_location)
    user.default_map_view = data.get("defaultMapView", user.default_map_view)

    db.session.commit()
    return user.to_dict()


class AuthService:
    """Compatibility wrapper expected by tests and other modules."""

    @staticmethod
    def register(email, password, name=None):
        from app.services.auth_services import register_user

        user = register_user(email, password)
        if user and name:
            user.name = name
            db.session.commit()
        return user

    @staticmethod
    def authenticate(email, password):
        from app.services.auth_services import authenticate_user

        return authenticate_user(email, password)

    @staticmethod
    def update_profile(user_id, data):
        return update_user_profile(user_id, data)
