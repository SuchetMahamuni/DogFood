from flask import Blueprint, request, jsonify
from app.schemas.event_schema import EventSchema
from app.services.event_service import EventService
from app.utils.permissions import require_auth, require_role
from marshmallow import ValidationError

events_bp = Blueprint('events', __name__)
event_schema = EventSchema()
events_schema = EventSchema(many=True)

@events_bp.route('/', methods=['GET'])
def get_events():
    events = EventService.get_events()
    return jsonify({'success': True, 'data': events_schema.dump(events)}), 200

@events_bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = EventService.get_event(event_id)
    if not event:
        return jsonify({'success': False, 'error': {'code': 'NOT_FOUND', 'message': 'Event not found.'}}), 404
    return jsonify({'success': True, 'data': event_schema.dump(event)}), 200

@events_bp.route('/', methods=['POST'])
@require_role(['ORGANIZER', 'ADMIN'])
def create_event():
    try:
        data = event_schema.load(request.json or {})
    except ValidationError as err:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': err.messages}}), 400
        
    event = EventService.create_event(data)
    return jsonify({'success': True, 'data': event_schema.dump(event)}), 201

@events_bp.route('/<int:event_id>', methods=['PATCH'])
@require_role(['ORGANIZER', 'ADMIN'])
def update_event(event_id):
    event = EventService.get_event(event_id)
    if not event:
        return jsonify({'success': False, 'error': {'code': 'NOT_FOUND', 'message': 'Event not found.'}}), 404
        
    try:
        data = event_schema.load(request.json or {}, partial=True)
    except ValidationError as err:
        return jsonify({'success': False, 'error': {'code': 'BAD_REQUEST', 'message': err.messages}}), 400
        
    updated_event = EventService.update_event(event, data)
    return jsonify({'success': True, 'data': event_schema.dump(updated_event)}), 200
