from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.database.db import db


class User(db.Model):
    
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(255), nullable=True)

    
    try:
        preferences = db.Column(db.JSON, nullable=True)
    except Exception:
        
        preferences = db.Column(db.Text, nullable=True)

    default_location = db.Column(db.String(255), nullable=True)
    default_map_view = db.Column(db.String(64), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<User {self.id} {self.email}>"

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        prefs = None
        try:
            prefs = self.preferences or {}
        except Exception:
            prefs = {}

        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'default_location': self.default_location or prefs.get('default_location'),
            'default_map_view': self.default_map_view or prefs.get('default_map_view'),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

