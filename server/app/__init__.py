from flask import Flask
from flask_cors import CORS
from app.database.db import db
from app.config import DevelopmentConfig

def create_app(config_class=DevelopmentConfig):
    """Application factory function"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register blueprints
    from app.routes import register_blueprints
    register_blueprints(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return appfrom flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import config
from app.database.db import db
from flask_cors import CORS

from app.routes.properties import properties_bp
from app.routes.dashboard import dashboard_bp

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    print(f"Running in '{config_name}' mode")
    print("Connected to database:", app.config["SQLALCHEMY_DATABASE_URI"])

    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}}, supports_credentials=True)

    db.init_app(app)
    Migrate(app, db)

    app.register_blueprint(properties_bp, url_prefix="/api/properties")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    return app
