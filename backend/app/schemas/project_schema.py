from marshmallow import Schema, fields, validate

class ProjectSchema(Schema):
    id = fields.Integer(dump_only=True)
    team_id = fields.Integer(dump_only=True)
    track_id = fields.Integer(allow_none=True)
    title = fields.String(required=True, validate=validate.Length(max=255))
    short_description = fields.String(validate=validate.Length(max=500))
    detailed_description = fields.String()
    repository_url = fields.Url(allow_none=True)
    demo_url = fields.Url(allow_none=True)
    video_url = fields.Url(allow_none=True)
    technologies = fields.String(validate=validate.Length(max=500))
    is_submitted = fields.Boolean(dump_only=True)
    submitted_at = fields.DateTime(dump_only=True)
