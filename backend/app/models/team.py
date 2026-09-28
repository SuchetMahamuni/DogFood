from datetime import datetime
from app.extensions import db

class Team(db.Model):
    __tablename__ = 'teams'

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    event = db.relationship('Event', back_populates='teams')
    members = db.relationship('TeamMember', back_populates='team', cascade='all, delete-orphan')
    invitations = db.relationship('TeamInvitation', back_populates='team', cascade='all, delete-orphan')
    project = db.relationship('Project', back_populates='team', uselist=False, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Team {self.name}>'
