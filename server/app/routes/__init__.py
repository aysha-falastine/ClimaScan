from app.routes.users import users_bp
from app.routes.dashboard import dashboard_bp
from app.routes.properties import properties_bp


def register_blueprints(app):
    app.register_blueprint(users_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(properties_bp)
    
