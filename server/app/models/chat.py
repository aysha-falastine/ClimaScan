from app.database.db import db
from datetime import datetime

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=True)
    
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    is_report_generated = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'response': self.response,
            'property_id': self.property_id,
            'is_report_generated': self.is_report_generated,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
