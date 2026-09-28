from flask import Blueprint, request, jsonify
from app.schemas.team_schema import TeamSchema, TeamInvitationSchema
from app.services.team_service import TeamService
from app.utils.permissions import require_auth
from marshmallow import ValidationError

teams_bp = Blueprint('teams', __name__)
team_schema = TeamSchema()
invite_schema = TeamInvitationSchema()

@teams_bp.route('/events/<int:event_id>/teams', methods=['POST'])
@require_auth
def create_team(event_id):
    try:
        data = request.json or {}
        if not data.get('name'):
            return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': 'Team name is required.'}}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': str(e)}}), 400
        
    team, error = TeamService.create_team(event_id, request.user.id, data['name'])
    if error:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': error}}), 400
        
    return jsonify({'success': True, 'data': team_schema.dump(team)}), 201

@teams_bp.route('/teams/<int:team_id>', methods=['GET'])
@require_auth
def get_team(team_id):
    team = TeamService.get_team(team_id)
    if not team:
        return jsonify({'success': False, 'error': {'code': 'NOT_FOUND', 'message': 'Team not found.'}}), 404
    return jsonify({'success': True, 'data': team_schema.dump(team)}), 200

@teams_bp.route('/teams/<int:team_id>/invite', methods=['POST'])
@require_auth
def invite_member(team_id):
    invitee_id = request.json.get('invitee_id')
    if not invitee_id:
         return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': 'invitee_id is required.'}}), 400
         
    invite, error = TeamService.invite_member(team_id, request.user.id, invitee_id)
    if error:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': error}}), 400
        
    return jsonify({'success': True, 'data': invite_schema.dump(invite)}), 201

@teams_bp.route('/teams/invitations/<int:invitation_id>/accept', methods=['POST'])
@require_auth
def accept_invitation(invitation_id):
    success, error = TeamService.accept_invitation(invitation_id, request.user.id)
    if error:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': error}}), 400
    return jsonify({'success': True, 'data': {'message': 'Invitation accepted.'}}), 200

@teams_bp.route('/teams/invitations/<int:invitation_id>/reject', methods=['POST'])
@require_auth
def reject_invitation(invitation_id):
    success, error = TeamService.reject_invitation(invitation_id, request.user.id)
    if error:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': error}}), 400
    return jsonify({'success': True, 'data': {'message': 'Invitation rejected.'}}), 200

@teams_bp.route('/teams/<int:team_id>/leave', methods=['POST'])
@require_auth
def leave_team(team_id):
    success, error = TeamService.leave_team(team_id, request.user.id)
    if error:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': error}}), 400
    return jsonify({'success': True, 'data': {'message': 'Left team successfully.'}}), 200
