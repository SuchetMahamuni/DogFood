from datetime import datetime
from app.extensions import db

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False, unique=True)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.id'), nullable=True)
    title = db.Column(db.String(255), nullable=False)
    short_description = db.Column(db.String(500))
    detailed_description = db.Column(db.Text)
    repository_url = db.Column(db.String(255))
    demo_url = db.Column(db.String(255))
    video_url = db.Column(db.String(255))
    technologies = db.Column(db.String(500))
    is_submitted = db.Column(db.Boolean, default=False)
    submitted_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    team = db.relationship('Team', back_populates='project')
    track = db.relationship('Track', back_populates='projects')

    def __repr__(self):
        return f'<Project {self.title}>'
