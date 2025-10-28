from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy instance
db = SQLAlchemy()


def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)

    with app.app_context():
        # Import all models here to ensure they're registered
        from app.models.user import User
        from app.models.property import Property
        from app.models.report import Report
        from app.models.climate_data import ClimateData

    # Create all tables
    db.create_all()
