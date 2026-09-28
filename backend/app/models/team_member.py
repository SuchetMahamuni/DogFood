from datetime import datetime
from app.extensions import db

class TeamMember(db.Model):
    __tablename__ = 'team_members'

    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(50), default='MEMBER') # LEADER, MEMBER
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    team = db.relationship('Team', back_populates='members')
    user = db.relationship('User')

    __table_args__ = (
        db.UniqueConstraint('team_id', 'user_id', name='uix_team_user'),
    )

    def __repr__(self):
        return f'<TeamMember {self.user_id} in {self.team_id}>'
