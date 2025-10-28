from flask import Flask


def register_blueprints(app: Flask):
    """Register all blueprints with consistent /api/ prefixes.

    Blueprints are imported lazily to avoid circular imports during extension
    initialization. If a blueprint module is missing it will be skipped.
    """
    # Users
    try:
        from app.routes.users import users_bp
        app.register_blueprint(users_bp, url_prefix="/api/users")
    except ImportError:
        pass

    # Profile (additional user profile routes)
    try:
        from app.routes.profile import profile_bp
        app.register_blueprint(profile_bp, url_prefix="/api/users")
    except ImportError:
        pass

    # Reports
    try:
        from app.routes.reports import reports_bp
        app.register_blueprint(reports_bp, url_prefix="/api/reports")
    except ImportError:
        pass

    # AI
    try:
        from app.routes.ai_chat import ai_bp
        app.register_blueprint(ai_bp, url_prefix="/api/ai")
    except ImportError:
        pass

    # Dashboard
    try:
        from app.routes.dashboard import dashboard_bp
        app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    except ImportError:
        pass

    # Properties
    try:
        from app.routes.properties import properties_bp
        app.register_blueprint(properties_bp, url_prefix="/api/properties")
    except ImportError:
        pass
