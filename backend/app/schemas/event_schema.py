from marshmallow import Schema, fields, validate

class TrackSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(max=255))
    description = fields.String()

class EventSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(max=255))
    description = fields.String()
    start_time = fields.DateTime(required=True)
    end_time = fields.DateTime(required=True)
    submission_deadline = fields.DateTime(required=True)
    status = fields.String(validate=validate.OneOf(['DRAFT', 'UPCOMING', 'LIVE', 'SUBMISSIONS_CLOSED', 'JUDGING', 'COMPLETED', 'ARCHIVED']))
    tracks = fields.List(fields.Nested(TrackSchema), dump_only=True)
