from flask import Blueprint, jsonify
from app.models.property import Property
# from app.models.report import Report
from app.database.db import db
from sqlalchemy import extract, func

dashboard_bp = Blueprint("dashboard_bp", __name__)

@dashboard_bp.route("/dashboard", methods=["GET"])
def get_dashboard_data():
    try:
        total_properties = Property.query.count()
        # reports_generated = Report.query.count()

        # high_risk = Report.query.filter(Report.risk_level == "High").count()
        # avg_risk = db.session.query(func.avg(Report.risk_score)).scalar() or 0

        # Count properties added per month
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
        ]

        # Count reports per month
        # monthly_reps = (
        #     db.session.query(
        #         extract('month', Report.date_generated).label('month'),
        #         func.count(Report.id).label('count')
        #     )
        #     .group_by('month')
        #     .all()
        # )
        # monthly_reports = [
        #     {"month": month_name(int(m)), "count": c} for m, c in monthly_reps
        # ]

        return jsonify({
            "total_properties": total_properties,
            # "reports_generated": reports_generated,
            # "high_risk": high_risk,
            # "average_risk": round(avg_risk, 2),
            "monthly_properties": monthly_properties,
            # "monthly_reports": monthly_reports
        }), 200

    except Exception as e:
        print("Dashboard Error:", e)
        return jsonify({"error": "Failed to fetch dashboard data"}), 500


def month_name(num):
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[num - 1] if 1 <= num <= 12 else "N/A"
