from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from config import DevelopmentConfig
from app.database.db import db
from app.routes import register_blueprints

# Extension instances
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=DevelopmentConfig):
    """Application factory function"""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # ✅ JWT setup
    app.config["JWT_SECRET_KEY"] = app.config["SECRET_KEY"]
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"
    app.config["JWT_IDENTITY_CLAIM"] = "identity"

    # ✅ CORS setup using config-defined origins
    allowed_origins = app.config["CORS_ORIGINS"]
    CORS(app, resources={r"/api/*": {
        "origins": allowed_origins,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"]
    }}, supports_credentials=True)

    # ✅ Optional: echo origin for strict dev environments
    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin")
        if origin and origin in allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
        response.headers.setdefault("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.setdefault("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        response.headers.setdefault("Access-Control-Expose-Headers", "Content-Type, Authorization")
        response.headers.setdefault("Access-Control-Allow-Credentials", "true")
        return response

    # ✅ Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # ✅ Register all blueprints
    register_blueprints(app)

    # ✅ Error handling (dev only)
    if app.debug:
        from werkzeug.exceptions import HTTPException

        @app.errorhandler(Exception)
        def handle_all_exceptions(e):
            if isinstance(e, HTTPException):
                return e
            import traceback
            traceback.print_exc()
            return jsonify({"error": "Internal Server Error"}), 500

    # ✅ Health check route
    @app.route('/')
    def index():
        return {'message': 'ClimaScan API is running'}

    return app
