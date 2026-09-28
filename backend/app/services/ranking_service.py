from app.services.normalization_service import NormalizationService
from app.models.criterion import Criterion
from app.extensions import db

class RankingService:
    @staticmethod
    def calculate_rankings(event_id):
        normalized_scores = NormalizationService.normalize_scores_for_event(event_id)
        
        criteria = Criterion.query.join(Criterion.rubric).filter(Criterion.rubric.has(event_id=event_id)).all()
        weights = {c.id: float(c.weight) for c in criteria}
        
        project_totals = {}
        for ns in normalized_scores:
            pid = ns['project_id']
            cid = ns['criterion_id']
            val = ns['normalized_value']
            weight = weights.get(cid, 1.0)
            
            if pid not in project_totals:
                project_totals[pid] = 0
            
            project_totals[pid] += val * weight
            
        ranked = [{'project_id': pid, 'final_score': score} for pid, score in project_totals.items()]
        ranked.sort(key=lambda x: x['final_score'], reverse=True)
        
        for i, r in enumerate(ranked):
            r['rank'] = i + 1
            
        return ranked
