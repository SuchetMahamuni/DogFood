from app.extensions import db

class Rubric(db.Model):
    __tablename__ = 'rubrics'

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)

    event = db.relationship('Event')
    criteria = db.relationship('Criterion', back_populates='rubric', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Rubric {self.name}>'
