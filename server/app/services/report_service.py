from app.models.report import Report
from app.database.db import db
import random

def generate_report(property_id):
    score = random.randint(10, 90)
    summary = f"Climate risk analysis shows an overall score of {score}%."

    report = Report(
        property_id=property_id,
        overall_score=score,
        ai_summary=summary
    )
    db.session.add(report)
    db.session.commit()

    return {
        "id": report.id,
        "property_id": property_id,
        "overall_score": score,
        "ai_summary": summary
    }

def get_reports_by_property(property_id):
    reports = Report.query.filter_by(property_id=property_id).all()
    return [
        {
            "id": r.id,
            "score": r.overall_score,
            "summary": r.ai_summary,
            "created_at": r.created_at.isoformat()
        }
        for r in reports
    ]
