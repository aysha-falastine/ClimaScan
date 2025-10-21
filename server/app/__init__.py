from flask import Flask
from .config import DevelopmentConfig
from .database.db import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    # Register blueprints
    from .routes import auth, users, properties, reports, dashboard
    app.register_blueprint(auth.bp)
    app.register_blueprint(users.bp)
    app.register_blueprint(properties.bp)
    app.register_blueprint(reports.bp)
    app.register_blueprint(dashboard.bp)

    return app