from app.extensions import db

class GuidanceResource(db.Model):
    __tablename__ = 'guidance_resources'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    topic = db.Column(db.String(100))
    skill = db.Column(db.String(100))
    stage = db.Column(db.String(50)) # IDEATION, TEAM_FORMATION, DEVELOPMENT, TESTING, SUBMISSION, JUDGING
    difficulty = db.Column(db.String(50))
    url = db.Column(db.String(255))
    thumbnail_url = db.Column(db.String(255))
    duration = db.Column(db.String(50))
    source = db.Column(db.String(100))

    def __repr__(self):
        return f'<GuidanceResource {self.title}>'
