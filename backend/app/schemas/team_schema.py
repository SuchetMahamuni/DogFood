from marshmallow import Schema, fields, validate
from app.schemas.user_schema import UserSchema
from app.schemas.project_schema import ProjectSchema

class TeamMemberSchema(Schema):
    id = fields.Integer(dump_only=True)
    user = fields.Nested(UserSchema, only=['id', 'name', 'profile.display_name'], dump_only=True)
    role = fields.String(dump_only=True)
    joined_at = fields.DateTime(dump_only=True)

class TeamSchema(Schema):
    id = fields.Integer(dump_only=True)
    event_id = fields.Integer(required=True)
    name = fields.String(required=True, validate=validate.Length(max=255))
    created_at = fields.DateTime(dump_only=True)
    members = fields.List(fields.Nested(TeamMemberSchema), dump_only=True)
    project = fields.Nested(ProjectSchema, dump_only=True)

class TeamInvitationSchema(Schema):
    id = fields.Integer(dump_only=True)
    team_id = fields.Integer(dump_only=True)
    invitee_id = fields.Integer(required=True)
    status = fields.String(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
