from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from flask import current_app

def hash_password(password: str) -> str:
    return generate_password_hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return check_password_hash(password_hash, password)

def generate_token(user_id: int, role: str) -> str:
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id,
        'role': role
    }
    return jwt.encode(
        payload,
        current_app.config.get('JWT_SECRET_KEY'),
        algorithm='HS256'
    )

def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            current_app.config.get('JWT_SECRET_KEY'),
            algorithms=['HS256']
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
