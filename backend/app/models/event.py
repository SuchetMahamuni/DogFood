from datetime import datetime
from app.extensions import db

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    submission_deadline = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default='DRAFT') # DRAFT, UPCOMING, LIVE, SUBMISSIONS_CLOSED, JUDGING, COMPLETED, ARCHIVED
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tracks = db.relationship('Track', back_populates='event', cascade='all, delete-orphan')
    teams = db.relationship('Team', back_populates='event', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Event {self.name}>'
