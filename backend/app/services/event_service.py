from app.extensions import db
from app.models.event import Event

class EventService:
    @staticmethod
    def get_events():
        return Event.query.all()
        
    @staticmethod
    def get_event(event_id):
        return db.session.get(Event, event_id)
        
    @staticmethod
    def create_event(data):
        event = Event(**data)
        db.session.add(event)
        db.session.commit()
        return event

    @staticmethod
    def update_event(event, data):
        for key, value in data.items():
            setattr(event, key, value)
        db.session.commit()
        return event
