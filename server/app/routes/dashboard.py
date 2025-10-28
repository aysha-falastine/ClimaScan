from flask import Blueprint, jsonify
from app.models.property import Property
from app.models.report import Report
from app.database.db import db
from sqlalchemy import extract, func

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/", methods=["GET"])
def get_dashboard_data():
    try:
        total_properties = Property.query.count()

        total_reports = Report.query.count()

        high_risk_properties = Report.query.filter(
            (Report.flood_score > 80) | (Report.heat_score > 80) | (Report.drainage_score > 80)
        ).count()

        avg_risk = (
            db.session.query(
                func.avg((Report.flood_score + Report.heat_score + Report.drainage_score) / 3)
            ).scalar() or 0
        )

        monthly_props = (
            db.session.query(
                extract('month', Property.date_added).label('month'),
                func.count(Property.id).label('count')
            )
            .group_by('month')
            .all()
        )

        monthly_properties = [
            {"month": month_name(int(m)), "count": c} for m, c in monthly_props
            if m is not None
        ]

        monthly_reports = (
            db.session.query(
                extract('month', Report.generated_at).label('month'),
                func.count(Report.id).label('count')
            )
            .group_by('month')
            .all()
        )

        monthly_reports_data = [
            {"month": month_name(int(m)), "count": c} for m, c in monthly_reports
            if m is not None
        ]

        return jsonify({
            "total_properties": total_properties,
            "reports_generated": total_reports,
            "high_risk_properties": high_risk_properties,
            "average_risk": round(avg_risk, 2),
            "monthly_properties": monthly_properties,
            "monthly_reports": monthly_reports_data
        }), 200

    except Exception:
        return jsonify({"error": "Failed to fetch dashboard data"}), 500


def month_name(num):
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[num - 1] if 1 <= num <= 12 else "N/A"
