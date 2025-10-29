# wsgi.py
import os
import sys
from app import create_app
from config import config

# Use production config by default, or based on FLASK_ENV
env = os.getenv('FLASK_ENV', 'production')
app = create_app(config.get(env, config['production']))

# Initialize database on first startup (production only)
if env == 'production':
    try:
        from app.database.db import db
        from sqlalchemy import text, inspect
        
        with app.app_context():
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            
            # If no tables exist, try to fix migration and create them
            if not tables or 'users' not in tables:
                print("⚠️  Database tables missing, attempting to create...")
                
                # Try to drop problematic alembic_version
                try:
                    db.session.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE"))
                    db.session.commit()
                    print("✅ Cleared alembic_version")
                except Exception as e:
                    print(f"Warning: Could not drop alembic_version: {e}")
                    db.session.rollback()
                
                # Try to run migrations
                try:
                    from flask_migrate import upgrade
                    upgrade()
                    print("✅ Migrations applied successfully")
                except Exception as e:
                    print(f"⚠️  Migration failed: {e}")
                    # Fallback: create tables directly from models
                    try:
                        db.create_all()
                        print("✅ Tables created directly from models")
                    except Exception as e2:
                        print(f"❌ Fatal: Could not create tables: {e2}")
                        sys.exit(1)
            else:
                print(f"✅ Database ready with tables: {', '.join(tables)}")
                
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
        # Don't exit - let the app try to start anyway
