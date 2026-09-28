from app.extensions import db

class Track(db.Model):
    __tablename__ = 'tracks'

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)

    event = db.relationship('Event', back_populates='tracks')
    projects = db.relationship('Project', back_populates='track')

    def __repr__(self):
        return f'<Track {self.name}>'
