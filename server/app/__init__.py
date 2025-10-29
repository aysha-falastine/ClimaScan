from flask import Flask, jsonify
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

    # Load configuration
    app.config.from_object(config_class)

    #  JWT setup (add this)
    app.config["JWT_SECRET_KEY"] = "your-secret-key"  # change this to something unique
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"
    # Avoid putting identity into the reserved 'sub' claim which some
    # PyJWT versions validate strictly as a string. Use a custom identity
    # claim so numeric IDs won't be placed into 'sub'.
    app.config["JWT_IDENTITY_CLAIM"] = "identity"

    # Allow known dev origins; also add an after_request hook below to echo the
    # incoming Origin header for development to avoid subtle mismatches.
    allowed_origins = ["https://clima-scan.vercel.app", "http://localhost:3000","http://127.0.0.1:3000"]

    CORS(app, resources={r"/api/*": {
        "origins": allowed_origins,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"]
    }}, supports_credentials=True)

    # Echo the origin header back in responses for matching dev origins and
    # ensure required CORS headers are always present. This helps browsers that
    # are strict about preflight checks when the origin varies between
    # `localhost` and `127.0.0.1` or when dev tooling uses a different host.
    @app.after_request
    def add_cors_headers(response):
        try:
            origin = None
            from flask import request
            origin = request.headers.get('Origin')
            # Log incoming origin and method for easier debugging in dev
            app.logger.debug(f"Incoming Origin={origin} Method={request.method} Path={request.path}")
            if origin and origin in allowed_origins:
                response.headers['Access-Control-Allow-Origin'] = origin
            # Ensure these are present for preflight/requests
            response.headers.setdefault('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            response.headers.setdefault('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            response.headers.setdefault('Access-Control-Expose-Headers', 'Content-Type, Authorization')
            response.headers.setdefault('Access-Control-Allow-Credentials', 'true')
        except Exception:
            # don't let CORS helper break the app in production
            app.logger.exception('Error while adding CORS headers')
        return response

    # ✅ Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # ✅ Register blueprints
    register_blueprints(app)

    # Development-only: log tracebacks but return a generic error message to avoid
    # leaking internals to clients. Keep full traceback in server logs.
    if app.debug:
        from werkzeug.exceptions import HTTPException

        @app.errorhandler(Exception)
        def handle_all_exceptions(e):
            # If it's an HTTPException (404, 405, etc.) let Flask handle it normally
            if isinstance(e, HTTPException):
                return e

            import traceback
            traceback.print_exc()
            # Return a generic error payload for the client; details are in server logs
            return jsonify({"error": "Internal Server Error"}), 500

    @app.route('/')
    def index():
        return {'message': 'ClimaScan API is running'}

    return app
