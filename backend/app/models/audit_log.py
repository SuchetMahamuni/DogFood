from datetime import datetime
from app.extensions import db

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True)
    actor_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    action = db.Column(db.String(255), nullable=False)
    resource_type = db.Column(db.String(100))
    resource_id = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    metadata_json = db.Column(db.Text) # Storing JSON as text

    actor = db.relationship('User')

    def __repr__(self):
        return f'<AuditLog {self.action}>'
