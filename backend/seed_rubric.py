from app import create_app
from app.extensions import db
from app.models.rubric import Rubric
from app.models.criterion import Criterion

app = create_app()

with app.app_context():
    r = Rubric.query.first()
    if not r:
        r = Rubric(name="Default Rubric", event_id=4) # Using event_id 4 or just let it float if possible
        db.session.add(r)
        db.session.flush()
        
        c = Criterion(id=1, rubric_id=r.id, name="Innovation", max_score=10)
        db.session.add(c)
        db.session.commit()
        print("Rubric seeded!")
