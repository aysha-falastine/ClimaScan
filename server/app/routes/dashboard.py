from flask import Blueprint, jsonify
from app.models.property import Property

from app.database.db import db
from sqlalchemy import extract, func

dashboard_bp = Blueprint("dashboard_bp", __name__)

@dashboard_bp.route("/", methods=["GET"])
def get_dashboard_data():
    try:
        total_properties = Property.query.count()

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

        return jsonify({
            "total_properties": total_properties,
            "monthly_properties": monthly_properties,
        }), 200

    except Exception as e:
        print("Dashboard Error:", e)
        return jsonify({"error": "Failed to fetch dashboard data"}), 500


def month_name(num):
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[num - 1] if 1 <= num <= 12 else "N/A"
