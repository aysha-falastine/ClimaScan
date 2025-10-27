from flask import Flask
from flask_cors import CORS
from app.routes.profile import profile_bp

def create_app():
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # ... other config ...
    
    # Register blueprint
    app.register_blueprint(profile_bp)
    
    return app