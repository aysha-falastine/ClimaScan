from datetime import datetime
from app import db

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    flood_score = db.Column(db.Float, nullable=False)
    heat_score = db.Column(db.Float, nullable=False)
    drainage_score = db.Column(db.Float, nullable=False)
    ai_summary = db.Column(db.Text, nullable=False)

    date_generated = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "property": {
                "id": self.property.id,
                "name": self.property.name,
                "location": self.property.location,
            },
            "flood_score": self.flood_score,
            "heat_score": self.heat_score,
            "drainage_score": self.drainage_score,
            "ai_summary": self.ai_summary,
            "date_generated": self.date_generated.isoformat() if self.date_generated else None,
        }
