from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.schemas.user_schema import RegisterSchema, LoginSchema, UserSchema
from app.services.auth_service import AuthService
from app.utils.permissions import require_auth

auth_bp = Blueprint('auth', __name__)
register_schema = RegisterSchema()
login_schema = LoginSchema()
user_schema = UserSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = register_schema.load(request.json or {})
    except ValidationError as err:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': err.messages}}), 400
        
    result, error = AuthService.register_user(data)
    if error:
        return jsonify({'success': False, 'error': {'code': 'CONFLICT', 'message': error}}), 409
        
    return jsonify({
        'success': True,
        'data': {
            'user': user_schema.dump(result['user']),
            'token': result['token']
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = login_schema.load(request.json or {})
    except ValidationError as err:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': err.messages}}), 400
        
    result, error = AuthService.login_user(data['email'], data['password'])
    if error:
        return jsonify({'success': False, 'error': {'code': 'UNAUTHORIZED', 'message': error}}), 401
        
    return jsonify({
        'success': True,
        'data': {
            'user': user_schema.dump(result['user']),
            'token': result['token']
        }
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@require_auth
def logout():
    return jsonify({'success': True, 'data': {'message': 'Successfully logged out.'}}), 200

@auth_bp.route('/me', methods=['GET'])
@require_auth
def get_me():
    return jsonify({
        'success': True,
        'data': user_schema.dump(request.user)
    }), 200
