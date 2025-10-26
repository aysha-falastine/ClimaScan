from flask import Flask
from flask_cors import CORS
from app.database.db import db
from app.config import DevConfig

def create_app(config_class=DevConfig):
    """Application factory function"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    
    # Register blueprints
    from app.routes import register_blueprints
    register_blueprints(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'instance', 'dev.db')}"


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'instance', 'prod.db')}"


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
