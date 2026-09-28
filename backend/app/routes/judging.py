from flask import Blueprint, request, jsonify
from app.schemas.judging_schema import SubmitScoresSchema
from app.services.scoring_service import ScoringService
from app.services.judge_assignment_service import JudgeAssignmentService
from app.utils.permissions import require_auth, require_role
from marshmallow import ValidationError

judging_bp = Blueprint('judging', __name__)
submit_scores_schema = SubmitScoresSchema()

@judging_bp.route('/assignments', methods=['GET', 'POST'])
@require_auth
def handle_assignments():
    if request.method == 'POST':
        if request.user.role not in ['ORGANIZER', 'ADMIN']:
            return jsonify({'success': False, 'error': {'code': 'FORBIDDEN', 'message': 'You do not have permission.'}}), 403
            
        data = request.json or {}
        judge_id = data.get('judge_id')
        project_id = data.get('project_id')
        event_id = data.get('event_id')
        
        if not all([judge_id, project_id, event_id]):
            return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': 'Missing required fields.'}}), 400
            
        assignment, error = JudgeAssignmentService.assign_judge(judge_id, project_id, event_id)
        if error:
            return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': error}}), 400
            
        return jsonify({'success': True, 'data': {'id': assignment.id, 'judge_id': assignment.judge_id, 'project_id': assignment.project_id}}), 201

    else:
        if request.user.role not in ['JUDGE', 'ORGANIZER', 'ADMIN']:
            return jsonify({'success': False, 'error': {'code': 'FORBIDDEN', 'message': 'You do not have permission.'}}), 403
            
        assignments = JudgeAssignmentService.get_judge_assignments(request.user.id)
        res = []
        for a in assignments:
            res.append({
                'id': a.id,
                'project_id': a.project_id,
                'status': a.status
            })
        return jsonify({'success': True, 'data': res}), 200

@judging_bp.route('/assignments/<int:assignment_id>/scores', methods=['POST'])
@require_role(['JUDGE'])
def submit_scores(assignment_id):
    try:
        data = submit_scores_schema.load(request.json or {})
    except ValidationError as err:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': err.messages}}), 400
        
    success, error = ScoringService.submit_scores(request.user.id, assignment_id, data['scores'])
    if error:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': error}}), 400
        
    return jsonify({'success': True, 'data': {'message': 'Scores submitted successfully.'}}), 200

@judging_bp.route('/events/<int:event_id>/results', methods=['GET'])
@require_role(['ORGANIZER', 'ADMIN'])
def get_results(event_id):
    from app.services.ranking_service import RankingService
    rankings = RankingService.calculate_rankings(event_id)
    return jsonify({'success': True, 'data': rankings}), 200
