
from .properties import properties_bp

def register_blueprints(app):
    
    app.register_blueprint(properties_bp, url_prefix="/api/properties")
