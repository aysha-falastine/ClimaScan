from app.database.db import db
from werkzeug.security import generate_password_hash, check_password_hash
<<<<<<< HEAD
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    preferences = db.Column(db.JSON, default={
        'default_location': 'Kenya',
        'default_map_view': 'Street'
    })
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    # Uncomment when Property model exists
    # properties = db.relationship('Property', backref='owner', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set user password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password against hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self, include_preferences=True):
        """Convert user to dictionary"""
        data = {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_preferences:
            preferences = self.preferences or {}
            data['default_location'] = preferences.get('default_location', '')
            data['default_map_view'] = preferences.get('default_map_view', 'Street')
        
        return data
    
    def __repr__(self):
        return f'<User {self.email}>'
=======
from flask import Blueprint

bp = Blueprint('users', __name__)

@bp.route('/api/users')
def get_users():
    return {'message': 'Users route working'}

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
>>>>>>> 2bba91972035a917e472e7e8fec7bc2f16a3eef4
