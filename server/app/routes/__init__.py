from flask import Flask

def register_blueprints(app: Flask):
    """Register all blueprints"""
    #from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    #from app.routes.properties import properties_bp
    from app.routes.reports import reports_bp
    #from app.routes.dashboard import dashboard_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(properties_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(dashboard_bp)