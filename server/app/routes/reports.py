from flask import Blueprint, jsonify, request
from app.models.property import Property
from app.models.report import Report
from app import db
from app.services.report_service import generate_report_data, generate_ai_summary

reports_bp = Blueprint("reports_bp", __name__)


@reports_bp.route("/", methods=["GET"])
def get_reports():
    reports = Report.query.all()
    return jsonify([r.to_dict() for r in reports])



@reports_bp.route("/<int:property_id>", methods=["GET"])
def get_property_report(property_id):
    property_obj = Property.query.get_or_404(property_id)

    
    report = Report.query.filter_by(property_id=property_id).first()

    if not report:
        
        data = generate_report_data(property_obj)
        ai_summary = generate_ai_summary(property_obj)

        report = Report(
            property_id=property_id,
            flood_score=data["flood_score"],
            heat_score=data["heat_score"],
            drainage_score=data["drainage_score"],
            ai_summary=ai_summary,
        )
        db.session.add(report)
        db.session.commit()

    return jsonify(report.to_dict())



@reports_bp.route("/reanalyze/<int:property_id>", methods=["POST"])
def reanalyze_property(property_id):
    property_obj = Property.query.get_or_404(property_id)

    data = generate_report_data(property_obj)
    ai_summary = generate_ai_summary(property_obj)

    report = Report.query.filter_by(property_id=property_id).first()
    if report:
        report.flood_score = data["flood_score"]
        report.heat_score = data["heat_score"]
        report.drainage_score = data["drainage_score"]
        report.ai_summary = ai_summary
    else:
        report = Report(
            property_id=property_id,
            **data,
            ai_summary=ai_summary
        )
        db.session.add(report)

    db.session.commit()
    return jsonify(report.to_dict()), 200



@reports_bp.route("/export/<int:property_id>", methods=["GET"])
def export_report(property_id):
    report = Report.query.filter_by(property_id=property_id).first_or_404()
    # Placeholder response; can integrate ReportLab later
    return jsonify({"message": f"Report for property {property_id} exported successfully"})
