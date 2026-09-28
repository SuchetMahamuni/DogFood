from marshmallow import Schema, fields, validate

class ProfileSchema(Schema):
    display_name = fields.String(validate=validate.Length(max=100))
    bio = fields.String()
    profile_picture_url = fields.String(validate=validate.Length(max=255))
    skills = fields.String(validate=validate.Length(max=255))
    interests = fields.String(validate=validate.Length(max=255))
    experience = fields.String(validate=validate.Length(max=255))
    preferred_role = fields.String(validate=validate.Length(max=100))
    availability = fields.String(validate=validate.Length(max=100))
    previous_projects = fields.String()

class UserSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True, validate=validate.Length(max=120))
    role = fields.String(dump_only=True)
    active = fields.Boolean(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    profile = fields.Nested(ProfileSchema, dump_only=True)

class RegisterSchema(UserSchema):
    password = fields.String(required=True, load_only=True, validate=validate.Length(min=6))

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)
