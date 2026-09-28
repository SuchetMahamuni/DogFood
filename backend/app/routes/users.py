from flask import Blueprint, request, jsonify
from app.schemas.user_schema import ProfileSchema
from app.services.matching_service import MatchingService
from app.utils.permissions import require_auth
from app.models.profile import Profile
from app.extensions import db

users_bp = Blueprint('users', __name__)
profile_schema = ProfileSchema()
profiles_schema = ProfileSchema(many=True)

@users_bp.route('/discover', methods=['GET'])
def discover_users():
    filters = {
        'skills': request.args.get('skills'),
        'interests': request.args.get('interests'),
        'preferred_role': request.args.get('preferred_role'),
        'availability': request.args.get('availability'),
        'experience': request.args.get('experience')
    }
    mode = request.args.get('mode')
    
    profiles = MatchingService.discover_users(filters, mode)
    return jsonify({'success': True, 'data': profiles_schema.dump(profiles)}), 200

@users_bp.route('/<int:user_id>/profile', methods=['GET'])
def get_user_profile(user_id):
    profile = Profile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({'success': False, 'error': {'code': 'NOT_FOUND', 'message': 'Profile not found.'}}), 404
    return jsonify({'success': True, 'data': profile_schema.dump(profile)}), 200
    
@users_bp.route('/me/matches', methods=['GET'])
@require_auth
def get_my_matches():
    if not request.user.profile:
         return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': 'You must complete your profile first.'}}), 400
         
    matches = MatchingService.get_matches(request.user.profile)
    result = []
    for m in matches:
        data = profile_schema.dump(m['profile'])
        data['match_score'] = m['score']
        result.append(data)
        
    return jsonify({'success': True, 'data': result}), 200
