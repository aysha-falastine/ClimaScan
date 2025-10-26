from flask import Flask

def register_blueprints(app: Flask):
    """Register all blueprints"""
    
    # Only import and register blueprints that exist
    try:
        from app.routes.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
    except ImportError:
        print("⚠️  Auth blueprint not found - skipping")
    
    try:
        from app.routes.users import users_bp
        app.register_blueprint(users_bp, url_prefix='/api/users')
    except ImportError:
        print("⚠️  Users blueprint not found - skipping")
    
    try:
        from app.routes.reports import reports_bp
        app.register_blueprint(reports_bp, url_prefix='/api/reports')
    except ImportError:
        print("⚠️  Reports blueprint not found - skipping")
    
    try:
        from app.routes.ai_chat import ai_bp
        app.register_blueprint(ai_bp, url_prefix='/api/ai')
    except ImportError:
        print("⚠️  AI Chat blueprint not found - skipping")
    
    print("✅ Blueprints registered successfully!")