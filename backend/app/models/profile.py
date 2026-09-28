from app.extensions import db

class Profile(db.Model):
    __tablename__ = 'profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    display_name = db.Column(db.String(100))
    bio = db.Column(db.Text)
    profile_picture_url = db.Column(db.String(255))
    skills = db.Column(db.String(255))
    interests = db.Column(db.String(255))
    experience = db.Column(db.String(255))
    preferred_role = db.Column(db.String(100))
    availability = db.Column(db.String(100))
    previous_projects = db.Column(db.Text)
    
    user = db.relationship('User', back_populates='profile')

    def __repr__(self):
        return f'<Profile {self.user_id}>'
