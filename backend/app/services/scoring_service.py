from app.extensions import db
from app.models.score import Score
from app.models.judge_assignment import JudgeAssignment
from app.models.criterion import Criterion

class ScoringService:
    @staticmethod
    def submit_scores(judge_id, assignment_id, scores_data):
        assignment = db.session.get(JudgeAssignment, assignment_id)
        if not assignment or assignment.judge_id != judge_id:
            return False, 'Assignment not found or unauthorized.'
            
        for score_data in scores_data:
            criterion = db.session.get(Criterion, score_data['criterion_id'])
            if not criterion:
                return False, f"Criterion {score_data['criterion_id']} not found."
                
            if score_data['value'] < 0 or score_data['value'] > criterion.max_score:
                return False, f"Score for criterion {criterion.name} must be between 0 and {criterion.max_score}."
                
            existing_score = Score.query.filter_by(
                assignment_id=assignment_id, 
                criterion_id=criterion.id
            ).first()
            
            if existing_score:
                existing_score.value = score_data['value']
                existing_score.comment = score_data.get('comment')
            else:
                new_score = Score(
                    assignment_id=assignment_id,
                    judge_id=judge_id,
                    project_id=assignment.project_id,
                    criterion_id=criterion.id,
                    value=score_data['value'],
                    comment=score_data.get('comment')
                )
                db.session.add(new_score)
                
        assignment.status = 'SCORED'
        import datetime
        assignment.completed_at = datetime.datetime.utcnow()
        db.session.commit()
        return True, None
