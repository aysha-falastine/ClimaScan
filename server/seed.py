from app import create_app, db
from app.models import Property

app = create_app()

with app.app_context():
    
    db.drop_all()
    db.create_all()

  
    sample_properties = [
        Property(name="Greenwood Apartments", location="Nairobi", date_added="2025-10-01"),
        Property(name="Coastal Breeze Villa", location="Mombasa", date_added="2025-09-20"),
        Property(name="Urban Heights", location="Kisumu", date_added="2025-08-15"),
        Property(name="Safari Suites", location="Nakuru", date_added="2025-10-10"),
        Property(name="Mountview Estate", location="Nyeri", date_added="2025-07-30"),
    ]

    db.session.add_all(sample_properties)
    db.session.commit()

    print("✅ Database seeded successfully!")
