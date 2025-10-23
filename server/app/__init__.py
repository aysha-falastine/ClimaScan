from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import config
from app.database import db
from app.routes import register_blueprints  # ✅ modular blueprint registration

def create_app(config_class=config.DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    Migrate(app, db)

    register_blueprints(app)  # ✅ centralized blueprint setup

    return app
