from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from app.database.db import db
from flask_jwt_extended import JWTManager
from config import DevelopmentConfig 
from app.routes import register_blueprints

from app.routes.properties import properties_bp
from app.routes.dashboard import dashboard_bp
from app.routes.reports import reports_bp

migrate = Migrate()

def create_app(config_class=DevelopmentConfig):
    """Application factory function"""
    app = Flask(__name__)  

# Load configuration
app.config.from_object(config_class)

# Proper CORS setup
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type"]
}})


    # Initialize extensions
    db.init_app(app)

    Migrate(app, db)
    JWTManager(app)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


    # Register blueprints
    from app.routes import register_blueprints
    register_blueprints(app)

    print("✅ App initialized successfully!")
    return app