from app.extensions import db

class Criterion(db.Model):
    __tablename__ = 'criteria'

    id = db.Column(db.Integer, primary_key=True)
    rubric_id = db.Column(db.Integer, db.ForeignKey('rubrics.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    weight = db.Column(db.Numeric(10, 2), default=1.0)
    max_score = db.Column(db.Integer, default=10)

    rubric = db.relationship('Rubric', back_populates='criteria')

    def __repr__(self):
        return f'<Criterion {self.name}>'
