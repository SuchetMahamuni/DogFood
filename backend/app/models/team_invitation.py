from datetime import datetime
from app.extensions import db

class TeamInvitation(db.Model):
    __tablename__ = 'team_invitations'

    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    inviter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    invitee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(50), default='PENDING') # PENDING, ACCEPTED, REJECTED
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    team = db.relationship('Team', back_populates='invitations')
    inviter = db.relationship('User', foreign_keys=[inviter_id])
    invitee = db.relationship('User', foreign_keys=[invitee_id])

    def __repr__(self):
        return f'<TeamInvitation to {self.invitee_id} for {self.team_id}>'
