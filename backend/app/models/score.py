from datetime import datetime
from app.extensions import db

class Score(db.Model):
    __tablename__ = 'scores'

    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('judge_assignments.id'), nullable=False)
    judge_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    criterion_id = db.Column(db.Integer, db.ForeignKey('criteria.id'), nullable=False)
    value = db.Column(db.Numeric(10, 2), nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    assignment = db.relationship('JudgeAssignment')
    judge = db.relationship('User', foreign_keys=[judge_id])
    project = db.relationship('Project')
    criterion = db.relationship('Criterion')

    __table_args__ = (
        db.UniqueConstraint('assignment_id', 'criterion_id', name='uix_assignment_criterion'),
    )

    def __repr__(self):
        return f'<Score {self.value} for {self.criterion_id}>'
