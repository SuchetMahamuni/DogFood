from flask import Blueprint, request, jsonify
from app.services.recommendation_service import RecommendationService
from marshmallow import Schema, fields

guidance_bp = Blueprint('guidance', __name__)

class GuidanceResourceSchema(Schema):
    id = fields.Integer(dump_only=True)
    title = fields.String()
    description = fields.String()
    topic = fields.String()
    skill = fields.String()
    stage = fields.String()
    difficulty = fields.String()
    url = fields.String()
    thumbnail_url = fields.String()
    duration = fields.String()
    source = fields.String()

guidance_schema = GuidanceResourceSchema(many=True)

@guidance_bp.route('/recommendations', methods=['GET'])
def get_recommendations():
    stage = request.args.get('stage')
    skills = request.args.get('skills')
    
    recommendations = RecommendationService.get_recommendations(stage=stage, skills=skills)
    return jsonify({'success': True, 'data': guidance_schema.dump(recommendations)}), 200
