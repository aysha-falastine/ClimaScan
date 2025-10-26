from flask import Flask
from flask_cors import CORS
from app.routes.auth import auth_bp
from app.routes.users import users_bp
from app.routes.reports import reports_bp
from app.routes.ai_chat import ai_bp

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for frontend requests
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register blueprints - only the ones you're working on
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    
    # Root route
    @app.route('/')
    def index():
        return {'message': '✅ ClimaScan API is running successfully!'}, 200
    
    return app
