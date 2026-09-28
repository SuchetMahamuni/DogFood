from app.models.guidance_resource import GuidanceResource

class RecommendationService:
    @staticmethod
    def get_recommendations(stage=None, skills=None, interests=None, track_id=None):
        query = GuidanceResource.query
        
        if stage:
            query = query.filter_by(stage=stage)
            
        if skills:
            skill_list = [s.strip() for s in skills.split(',')]
            if skill_list:
                query = query.filter(GuidanceResource.skill.in_(skill_list))
                
        return query.limit(10).all()
