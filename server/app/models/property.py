from datetime import datetime
from app.database.db import db

class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    date_added = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Optional: assign properties to users
    # Note: the users table in this app is named 'user' (singular) so the FK should
    # reference 'user.id'. Keep consistent with `User.__tablename__`.
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Relationship to reports
    reports = db.relationship('Report', backref='property', lazy=True)

    def __repr__(self):
        return f"<Property {self.id} {self.name}>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "date_added": self.date_added.isoformat() if self.date_added else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "user_id": self.user_id
        }
