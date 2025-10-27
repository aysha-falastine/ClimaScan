from flask import Flask

def register_blueprints(app: Flask):
    
    
    # Only import and register blueprints that exist
    try:
        from app.routes.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
    except ImportError:
        print
    
    try:
        from app.routes.users import users_bp
        app.register_blueprint(users_bp, url_prefix='/api/users')
    except ImportError:
        print
    
    try:
        from app.routes.reports import reports_bp
        app.register_blueprint(reports_bp, url_prefix='/api/reports')
    except ImportError:
        print
    
    try:
        from app.routes.ai_chat import ai_bp
        app.register_blueprint(ai_bp, url_prefix='/api/ai')
    except ImportError:
        print
    
    try:
        from app.routes.dashboard import dashboard_bp
        app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    except ImportError:
        print
    
    try:
        from app.routes.properties import properties_bp
        app.register_blueprint(properties_bp, url_prefix='/api/properties')
    except ImportError:
        print
    
    print



def register_blueprints(app):
print

# Register the main API blueprints with prefixes
app.register_blueprint(users_bp, url_prefix="/api/users")
app.register_blueprint(properties_bp, url_prefix="/api/properties")
app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")

print

