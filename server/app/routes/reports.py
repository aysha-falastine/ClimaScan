from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.report import Report

from app.database.db import db

from datetime import datetime

reports_bp = Blueprint('reports', __name__, url_prefix='/api/reports')

@reports_bp.route('/generate/<int:property_id>', methods=['POST'])
@jwt_required()
def generate_report(property_id):
    """Generate a new climate risk report for a property"""
    user_id = get_jwt_identity()
    
    # Verify property ownership
    property_obj = Property.query.filter_by(id=property_id, user_id=user_id).first()
    if not property_obj:
        return jsonify({'error': 'Property not found or access denied'}), 404
    
    try:
        # Generate report using service
        report_data = generate_climate_report(property_obj)
        
        # Create report record
        report = Report(
            property_id=property_id,
            flood_score=report_data['flood_score'],
            heat_score=report_data['heat_score'],
            drainage_score=report_data['drainage_score'],
            overall_score=report_data['overall_score'],
            ai_summary=report_data['ai_summary'],
            generated_at=datetime.utcnow()
        )
        
        db.session.add(report)
        db.session.commit()
        
        return jsonify({
            'message': 'Report generated successfully',
            'report': report.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to generate report: {str(e)}'}), 500

@reports_bp.route('/<int:report_id>', methods=['GET'])
@jwt_required()
def get_report(report_id):
    """Get a specific report by ID"""
    user_id = get_jwt_identity()
    
    # Query with ownership verification
    report = Report.query.join(Property).filter(
        Report.id == report_id,
        Property.user_id == user_id
    ).first()
    
    if not report:
        return jsonify({'error': 'Report not found'}), 404
    
    return jsonify(report.to_dict()), 200

@reports_bp.route('/property/<int:property_id>', methods=['GET'])
@jwt_required()
def get_property_reports(property_id):
    """Get all reports for a specific property"""
    user_id = get_jwt_identity()
    
    # Verify property ownership
    property_obj = Property.query.filter_by(id=property_id, user_id=user_id).first()
    if not property_obj:
        return jsonify({'error': 'Property not found'}), 404
    
    # Get all reports for this property
    reports = Report.query.filter_by(property_id=property_id).order_by(Report.generated_at.desc()).all()
    
    return jsonify({
        'property': property_obj.to_dict(),
        'reports': [r.to_dict() for r in reports]
    }), 200

@reports_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_user_reports():
    """Get all reports for the current user"""
    user_id = get_jwt_identity()
    
    reports = Report.query.join(Property).filter(
        Property.user_id == user_id
    ).order_by(Report.generated_at.desc()).all()
    
    return jsonify([r.to_dict() for r in reports]), 200

@reports_bp.route('/<int:report_id>/export', methods=['GET'])
@jwt_required()
def export_report(report_id):
    """Export report as PDF"""
    user_id = get_jwt_identity()
    
    report = Report.query.join(Property).filter(
        Report.id == report_id,
        Property.user_id == user_id
    ).first()
    
    if not report:
        return jsonify({'error': 'Report not found'}), 404
    
    try:
        # Generate PDF
        pdf_path = export_report_to_pdf(report)
        
        return send_file(
            pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'climate_report_{report.property.name}_{report.generated_at.strftime("%Y%m%d")}.pdf'
        )
    except Exception as e:
        return jsonify({'error': f'Failed to export report: {str(e)}'}), 500

@reports_bp.route('/<int:report_id>/re-analyze', methods=['POST'])
@jwt_required()
def re_analyze_report(report_id):
    """Re-analyze property and create new report"""
    user_id = get_jwt_identity()
    
    # Get existing report
    old_report = Report.query.join(Property).filter(
        Report.id == report_id,
        Property.user_id == user_id
    ).first()
    
    if not old_report:
        return jsonify({'error': 'Report not found'}), 404
    
    try:
        # Generate new report
        property_obj = old_report.property
        report_data = generate_climate_report(property_obj)
        
        # Create new report
        new_report = Report(
            property_id=property_obj.id,
            flood_score=report_data['flood_score'],
            heat_score=report_data['heat_score'],
            drainage_score=report_data['drainage_score'],
            overall_score=report_data['overall_score'],
            ai_summary=report_data['ai_summary'],
            generated_at=datetime.utcnow()
        )
        
        db.session.add(new_report)
        db.session.commit()
        
        return jsonify({
            'message': 'Report re-analyzed successfully',
            'report': new_report.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to re-analyze: {str(e)}'}), 500

@reports_bp.route('/<int:report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    """Delete a report"""
    user_id = get_jwt_identity()
    
    report = Report.query.join(Property).filter(
        Report.id == report_id,
        Property.user_id == user_id
    ).first()
    
    if not report:
        return jsonify({'error': 'Report not found'}), 404
    
    try:
        db.session.delete(report)
        db.session.commit()
        return jsonify({'message': 'Report deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
