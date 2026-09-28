from datetime import datetime
from app.extensions import db

class JudgeAssignment(db.Model):
    __tablename__ = 'judge_assignments'

    id = db.Column(db.Integer, primary_key=True)
    judge_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    status = db.Column(db.String(50), default='PENDING') # PENDING, SCORED
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)

    judge = db.relationship('User', foreign_keys=[judge_id])
    project = db.relationship('Project')
    event = db.relationship('Event')

    def __repr__(self):
        return f'<JudgeAssignment Judge:{self.judge_id} Project:{self.project_id}>'
