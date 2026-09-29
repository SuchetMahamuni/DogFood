from app import create_app
from app.extensions import db
from app.models.event import Event
import datetime

app = create_app()

with app.app_context():
    if Event.query.first():
        print("Events already seeded.")
    else:
        now = datetime.datetime.utcnow()
        
        events = [
            Event(name='DogFood Global Hackathon 2026', 
                  description='The premier open-source hackathon for software engineers, product builders, and designers building next-generation developer platforms.',
                  start_time=now - datetime.timedelta(days=1),
                  end_time=now + datetime.timedelta(days=3),
                  submission_deadline=now + datetime.timedelta(days=2),
                  status='LIVE'),
            Event(name='Autonomous Systems & Robotics Sprint', 
                  description='A 48-hour intensive building challenge focusing on autonomous agents, robotics simulation, and edge intelligence.',
                  start_time=now + datetime.timedelta(days=7),
                  end_time=now + datetime.timedelta(days=9),
                  submission_deadline=now + datetime.timedelta(days=9),
                  status='UPCOMING'),
            Event(name='FinTech & Web Security Challenge', 
                  description='Building ultra-reliable financial software, verification protocols, and real-time fraud detection systems.',
                  start_time=now - datetime.timedelta(days=10),
                  end_time=now - datetime.timedelta(days=2),
                  submission_deadline=now - datetime.timedelta(days=2),
                  status='COMPLETED')
        ]
        
        db.session.bulk_save_objects(events)
        db.session.commit()
        print("Events seeded realistically!")
