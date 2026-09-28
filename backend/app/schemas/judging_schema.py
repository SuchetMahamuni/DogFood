from marshmallow import Schema, fields, validate

class ScoreSchema(Schema):
    criterion_id = fields.Integer(required=True)
    value = fields.Float(required=True)
    comment = fields.String()

class SubmitScoresSchema(Schema):
    scores = fields.List(fields.Nested(ScoreSchema), required=True)
