from app import create_app
from app.database.db import db
from app.models.property import Property
from app.models.user import User
from datetime import datetime

app = create_app()

with app.app_context():
    # reset schema for local dev (careful in production)
    db.drop_all()
    db.create_all()

    # create a default test user and assign properties to that user to satisfy FK constraints
    default_user = User(email="test@example.com", name="Test User")
    default_user.set_password("password")
    db.session.add(default_user)
    db.session.commit()

    sample_properties = [
        Property(name="Greenwood Apartments", location="Nairobi", date_added=datetime(2025,10,1).date(), user_id=default_user.id),
        Property(name="Coastal Breeze Villa", location="Mombasa", date_added=datetime(2025,9,20).date(), user_id=default_user.id),
        Property(name="Urban Heights", location="Kisumu", date_added=datetime(2025,8,15).date(), user_id=default_user.id),
        Property(name="Safari Suites", location="Nakuru", date_added=datetime(2025,10,10).date(), user_id=default_user.id),
        Property(name="Mountview Estate", location="Nyeri", date_added=datetime(2025,7,30).date(), user_id=default_user.id),
    ]

    db.session.add_all(sample_properties)
    db.session.commit()

    print("Database seeded successfully")
