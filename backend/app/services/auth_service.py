from app.extensions import db
from app.models.user import User
from app.models.profile import Profile
from app.utils.security import hash_password, generate_token

class AuthService:
    @staticmethod
    def register_user(data):
        if User.query.filter_by(email=data['email']).first():
            return None, 'Email already exists.'
            
        new_user = User(
            name=data['name'],
            email=data['email'],
            password_hash=hash_password(data['password']),
            role='PARTICIPANT'
        )
        db.session.add(new_user)
        db.session.flush() # To get the user ID
        
        # Create empty profile
        new_profile = Profile(user_id=new_user.id, display_name=data['name'])
        db.session.add(new_profile)
        db.session.commit()
        
        token = generate_token(new_user.id, new_user.role)
        return {'user': new_user, 'token': token}, None

    @staticmethod
    def login_user(email, password):
        from app.utils.security import verify_password
        user = User.query.filter_by(email=email).first()
        if not user or not verify_password(password, user.password_hash):
            return None, 'Invalid credentials.'
        if not user.active:
            return None, 'Account is inactive.'
            
        token = generate_token(user.id, user.role)
        return {'user': user, 'token': token}, None
