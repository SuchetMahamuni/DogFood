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

@teams_bp.route('/events/<int:event_id>/my-team', methods=['GET'])
@require_auth
def get_my_team_for_event(event_id):
    from app.models.team import Team
    from app.models.team_member import TeamMember
    member = TeamMember.query.join(Team).filter(Team.event_id == event_id, TeamMember.user_id == request.user.id).first()
    if not member:
        return jsonify({'success': True, 'data': None}), 200
    team = TeamService.get_team(member.team_id)
    return jsonify({'success': True, 'data': team_schema.dump(team)}), 200

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
    from app.models.user import User
    data = request.json or {}
    invitee_id = data.get('invitee_id')
    identifier = data.get('identifier')

    user_to_invite = None
    if invitee_id:
        user_to_invite = User.query.get(invitee_id)
    elif identifier:
        user_to_invite = User.query.filter_by(email=identifier).first()
        if not user_to_invite:
            try:
                # Fallback if they typed an ID as string
                user_to_invite = User.query.get(int(identifier))
            except ValueError:
                pass

    if not user_to_invite:
         return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': 'Please provide a valid participant user ID or email.'}}), 400
         
    if user_to_invite.role != 'PARTICIPANT':
         return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': 'Only participants can be invited to a team.'}}), 400

    invite, error = TeamService.invite_member(team_id, request.user.id, user_to_invite.id)
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

@teams_bp.route('/teams/invitations', methods=['GET'])
@require_auth
def get_my_invitations():
    invitations = TeamService.get_my_invitations(request.user.id)
    return jsonify({'success': True, 'data': invite_schema.dump(invitations, many=True)}), 200
