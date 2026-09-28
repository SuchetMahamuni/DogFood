from functools import wraps
from flask import request, jsonify
from app.utils.security import verify_token
from app.models.user import User
from app.extensions import db

def require_auth(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'success': False, 'error': {'code': 'UNAUTHORIZED', 'message': 'Missing or invalid token.'}}), 401
        
        token = auth_header.split(' ')[1]
        payload = verify_token(token)
        
        if not payload:
            return jsonify({'success': False, 'error': {'code': 'UNAUTHORIZED', 'message': 'Expired or invalid token.'}}), 401
            
        user = db.session.get(User, payload['sub'])
        if not user or not user.active:
            return jsonify({'success': False, 'error': {'code': 'UNAUTHORIZED', 'message': 'User not found or inactive.'}}), 401
            
        request.user = user
        return func(*args, **kwargs)
    return wrapper

def require_role(allowed_roles):
    def decorator(func):
        @wraps(func)
        @require_auth
        def wrapper(*args, **kwargs):
            if request.user.role not in allowed_roles:
                return jsonify({'success': False, 'error': {'code': 'FORBIDDEN', 'message': 'You do not have permission to access this resource.'}}), 403
            return func(*args, **kwargs)
        return wrapper
    return decorator
