import math
from app.models.score import Score
from app.models.judge_assignment import JudgeAssignment

class NormalizationService:
    @staticmethod
    def normalize_scores_for_event(event_id):
        scores = Score.query.join(JudgeAssignment).filter(JudgeAssignment.event_id == event_id).all()
        
        judge_scores = {}
        for s in scores:
            if s.judge_id not in judge_scores:
                judge_scores[s.judge_id] = []
            judge_scores[s.judge_id].append(float(s.value))
            
        judge_stats = {}
        for j_id, vals in judge_scores.items():
            n = len(vals)
            if n < 2:
                judge_stats[j_id] = {'mean': vals[0] if n==1 else 0, 'std': 1}
            else:
                mean = sum(vals) / n
                variance = sum((v - mean) ** 2 for v in vals) / (n - 1)
                std = math.sqrt(variance) if variance > 0 else 1
                judge_stats[j_id] = {'mean': mean, 'std': std}
                
        normalized_results = []
        for s in scores:
            stats = judge_stats[s.judge_id]
            z_score = (float(s.value) - stats['mean']) / stats['std']
            normalized_val = (z_score * 15) + 75 
            
            normalized_results.append({
                'score_id': s.id,
                'project_id': s.project_id,
                'criterion_id': s.criterion_id,
                'raw_value': float(s.value),
                'normalized_value': normalized_val
            })
            
        return normalized_results
