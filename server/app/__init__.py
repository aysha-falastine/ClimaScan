from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import config
from app.database.db import db
from flask_cors import CORS


from app.routes import register_blueprints


from app.routes.dashboard import dashboard_bp


def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    print(f"Running in '{config_name}' mode")
    print("Connected to database:", app.config["SQLALCHEMY_DATABASE_URI"])

    
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    
    db.init_app(app)
    Migrate(app, db)

    
    register_blueprints(app)

    
    # app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

    return app
