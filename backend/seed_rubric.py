from app import create_app
from app.extensions import db
from app.models.rubric import Rubric
from app.models.criterion import Criterion
from app.models.event import Event

app = create_app()

with app.app_context():
    r = Rubric.query.first()
    if not r:
        e = Event.query.first()
        if e:
            r = Rubric(name="Default Rubric", event_id=e.id)
            db.session.add(r)
            db.session.flush()
            
            c = Criterion(id=1, rubric_id=r.id, name="Innovation", max_score=10)
            db.session.add(c)
            db.session.commit()
            print("Rubric seeded!")
        else:
            print("No events found to attach rubric to!")
    else:
        print("Rubric already seeded!")
