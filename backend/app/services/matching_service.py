import random
from app.models.profile import Profile
from app.models.user import User

class MatchingService:
    @staticmethod
    def discover_users(filters, mode):
        query = Profile.query.join(User).filter(User.active == True)
        
        if mode == 'random':
            from sqlalchemy.sql.expression import func
            query = query.order_by(func.random())
        else:
            if filters.get('skills'):
                query = query.filter(Profile.skills.ilike(f"%{filters['skills']}%"))
            if filters.get('interests'):
                query = query.filter(Profile.interests.ilike(f"%{filters['interests']}%"))
            if filters.get('preferred_role'):
                query = query.filter(Profile.preferred_role == filters['preferred_role'])
            if filters.get('availability'):
                query = query.filter(Profile.availability == filters['availability'])
            if filters.get('experience'):
                query = query.filter(Profile.experience == filters['experience'])
                
        return query.limit(50).all()
        
    @staticmethod
    def calculate_match_score(user_profile, other_profile):
        score = 0
        
        # Simple string-based matching for now
        def _intersect_score(str1, str2):
            if not str1 or not str2: return 0
            set1 = set(s.strip().lower() for s in str1.split(','))
            set2 = set(s.strip().lower() for s in str2.split(','))
            return len(set1.intersection(set2))
            
        score += _intersect_score(user_profile.skills, other_profile.skills) * 2
        score += _intersect_score(user_profile.interests, other_profile.interests) * 1
        
        # Complementary roles logic could be added here
        
        if user_profile.experience == other_profile.experience and user_profile.experience:
            score += 1
            
        if user_profile.availability == other_profile.availability and user_profile.availability:
            score += 2
            
        return score

    @staticmethod
    def get_matches(user_profile):
        all_profiles = Profile.query.join(User).filter(User.active == True, Profile.id != user_profile.id).all()
        
        scored_profiles = []
        for p in all_profiles:
            score = MatchingService.calculate_match_score(user_profile, p)
            scored_profiles.append({'profile': p, 'score': score})
            
        # Sort descending
        scored_profiles.sort(key=lambda x: x['score'], reverse=True)
        return scored_profiles[:20]
