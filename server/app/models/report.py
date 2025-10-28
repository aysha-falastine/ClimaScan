from app.database.db import db
from datetime import datetime

class Report(db.Model):
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    flood_score = db.Column(db.Integer, nullable=False)
    heat_score = db.Column(db.Integer, nullable=False)
    drainage_score = db.Column(db.Integer, nullable=False)
    overall_score = db.Column(db.Integer, nullable=False)
    ai_summary = db.Column(db.Text, nullable=False)
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'property_id': self.property_id,
            'property_name': self.property.name if self.property else None,
            'property_address': self.property.location if self.property else None,
            'flood_score': self.flood_score,
            'heat_score': self.heat_score,
            'drainage_score': self.drainage_score,
            'overall_score': self.overall_score,
            'ai_summary': self.ai_summary,
            'generated_at': self.generated_at.isoformat()
        }
