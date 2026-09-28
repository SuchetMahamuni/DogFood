from flask import Blueprint, request, jsonify
from app.schemas.project_schema import ProjectSchema
from app.services.project_service import ProjectService
from app.utils.permissions import require_auth
from marshmallow import ValidationError

projects_bp = Blueprint('projects', __name__)
project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)

@projects_bp.route('/teams/<int:team_id>/project', methods=['POST'])
@require_auth
def create_project(team_id):
    try:
        data = project_schema.load(request.json or {})
    except ValidationError as err:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': err.messages}}), 400
        
    project, error = ProjectService.create_project(team_id, request.user.id, data)
    if error:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': error}}), 400
        
    return jsonify({'success': True, 'data': project_schema.dump(project)}), 201

@projects_bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = ProjectService.get_project(project_id)
    if not project:
        return jsonify({'success': False, 'error': {'code': 'NOT_FOUND', 'message': 'Project not found.'}}), 404
    return jsonify({'success': True, 'data': project_schema.dump(project)}), 200

@projects_bp.route('/projects/<int:project_id>', methods=['PATCH'])
@require_auth
def update_project(project_id):
    try:
        data = project_schema.load(request.json or {}, partial=True)
    except ValidationError as err:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': err.messages}}), 400
        
    project, error = ProjectService.update_project(project_id, request.user.id, data)
    if error:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': error}}), 400
        
    return jsonify({'success': True, 'data': project_schema.dump(project)}), 200

@projects_bp.route('/projects/<int:project_id>/submit', methods=['POST'])
@require_auth
def submit_project(project_id):
    success, error = ProjectService.submit_project(project_id, request.user.id)
    if error:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': error}}), 400
    return jsonify({'success': True, 'data': {'message': 'Project submitted successfully.'}}), 200

@projects_bp.route('/events/<int:event_id>/projects', methods=['GET'])
def get_event_projects(event_id):
    public_only = request.args.get('public_only', 'true').lower() == 'true'
    projects = ProjectService.get_event_projects(event_id, public_only)
    return jsonify({'success': True, 'data': projects_schema.dump(projects)}), 200
