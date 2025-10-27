from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import config
from app.database.db import db
from flask_cors import CORS

from app.routes.properties import properties_bp
from app.routes.dashboard import dashboard_bp
from app.routes.reports import reports_bp

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    print(f"Running in '{config_name}' mode")
    print("Connected to database:", app.config["SQLALCHEMY_DATABASE_URI"])

    CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type"]
}})


    db.init_app(app)
    Migrate(app, db)

    app.register_blueprint(properties_bp, url_prefix="/api/properties")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")

    return app
