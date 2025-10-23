from flask import Flask
from .config import DevelopmentConfig
from app.database.db import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.routes import register_blueprints  # centralized blueprint setup

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    CORS(app)

    register_blueprints(app)  # clean, centralized blueprint registration

    return app
