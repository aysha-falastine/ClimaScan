from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.report import Report
from app.models.property import Property
from app.database.db import db
from datetime import datetime
from app.services.report_service import generate_report_data
from app.services.climate_api_service import generate_ai_report
import tempfile, os

reports_bp = Blueprint('reports', __name__)

def generate_climate_report(property_obj):
    """Generate scores and AI summary; return payload including ai source."""
    scores = generate_report_data(property_obj)
    ai_result = generate_ai_report(property_obj.to_dict())
    ai_summary = ai_result.get('ai_summary') if isinstance(ai_result, dict) else str(ai_result)
    ai_source = ai_result.get('source', 'fallback') if isinstance(ai_result, dict) else 'fallback'
    overall = int((scores['flood_score'] + scores['heat_score'] + scores['drainage_score']) / 3)
    return {
        'flood_score': scores['flood_score'],
        'heat_score': scores['heat_score'],
        'drainage_score': scores['drainage_score'],
        'overall_score': overall,
        'ai_summary': ai_summary,
        'ai_source': ai_source
    }

def export_report_to_pdf(report):
    fd, path = tempfile.mkstemp(suffix='.pdf')
    os.close(fd)
    content = [
        f"Climate Report for Property: {report.property.name if report.property else 'Unknown'}",
        f"Generated: {report.generated_at.isoformat() if report.generated_at else ''}",
        "\nScores:",
        f"  Flood: {report.flood_score}",
        f"  Heat: {report.heat_score}",
        f"  Drainage: {report.drainage_score}",
        f"  Overall: {report.overall_score}",
        "\nAI Summary:\n",
        report.ai_summary or ''
    ]
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(content))
    return path

# GET all reports for a property
@reports_bp.route('/property/<int:property_id>', methods=['GET'])
@jwt_required()
def get_property_reports(property_id):
    # No user_id filtering for now
    property_obj = Property.query.get(property_id)
    if not property_obj:
        return jsonify({'error': 'Property not found'}), 404
    reports = Report.query.filter_by(property_id=property_id).order_by(Report.generated_at.desc()).all()

    def annotate_ai_source(rdict):
        # crude heuristic: if the ai_summary contains the offline marker, mark as fallback
        summary = (rdict.get('ai_summary') or '').strip()
        if summary.startswith('Climate Risk Report (Offline Mode)'):
            rdict['ai_source'] = 'fallback'
        else:
            rdict['ai_source'] = 'hf'
        return rdict

    return jsonify({
        'property': property_obj.to_dict(),
        'reports': [annotate_ai_source(r.to_dict()) for r in reports]
    }), 200


# POST generate a new report for a property
@reports_bp.route('/property/<int:property_id>/generate', methods=['POST'])
@jwt_required()
def generate_property_report(property_id):
    property_obj = Property.query.get(property_id)
    if not property_obj:
        return jsonify({'error': 'Property not found'}), 404

    # build scores and ai summary
    try:
        payload = generate_climate_report(property_obj)
        report = Report(
            property_id=property_id,
            flood_score=payload['flood_score'],
            heat_score=payload['heat_score'],
            drainage_score=payload['drainage_score'],
            overall_score=payload['overall_score'],
            ai_summary=payload.get('ai_summary') or ''
        )
        db.session.add(report)
        db.session.commit()
        # include ai_source in the response so the client can show whether HF or fallback was used
        resp = report.to_dict()
        resp['ai_source'] = payload.get('ai_source', 'unknown')
        return jsonify({'report': resp}), 201
    except Exception as e:
        # keep error local to reports feature
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to generate report'}), 500


# Re-analyze (regenerate) an existing report by id
@reports_bp.route('/<int:report_id>/re-analyze', methods=['POST'])
@jwt_required()
def reanalyze_report(report_id):
    report = Report.query.get(report_id)
    if not report:
        return jsonify({'error': 'Report not found'}), 404

    property_obj = report.property
    if not property_obj:
        return jsonify({'error': 'Associated property not found'}), 404

    try:
        payload = generate_climate_report(property_obj)
        report.flood_score = payload['flood_score']
        report.heat_score = payload['heat_score']
        report.drainage_score = payload['drainage_score']
        report.overall_score = payload['overall_score']
        report.ai_summary = payload.get('ai_summary') or report.ai_summary
        report.generated_at = datetime.utcnow()
        db.session.commit()

        resp = report.to_dict()
        resp['ai_source'] = payload.get('ai_source', 'unknown')
        return jsonify({'report': resp}), 200
    except Exception:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to re-analyze report'}), 500


# Export report as PDF
@reports_bp.route('/<int:report_id>/export', methods=['GET'])
@jwt_required()
def export_report(report_id):
    report = Report.query.get(report_id)
    if not report:
        return jsonify({'error': 'Report not found'}), 404

    try:
        pdf_path = export_report_to_pdf(report)
        property_name = report.property.name if report.property else 'property'
        filename = f'climate_report_{property_name}.pdf'
        return send_file(pdf_path, as_attachment=True, download_name=filename, mimetype='application/pdf')
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Failed to export report'}), 500
