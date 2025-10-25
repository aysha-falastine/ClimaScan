from flask import Flask
from .config import DevelopmentConfig
from app.database.db import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.routes import register_blueprints  # centralized blueprint setup
from config import config
from flask_sqlalchemy import SQLAlchemy

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    print(f"Running in '{config_name}' mode")
    print("Connected to database:", app.config["SQLALCHEMY_DATABASE_URI"])

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    CORS(app)

    register_blueprints(app)  # clean, centralized blueprint registration

    return app
