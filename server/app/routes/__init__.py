from flask import Blueprint
from .properties import properties_bp
from .dashboard import dashboard_bp

def register_blueprints(app):
    
    app.register_blueprint(properties_bp, url_prefix="/api/properties")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
