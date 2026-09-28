from app.extensions import db
from app.models.judge_assignment import JudgeAssignment
from app.models.project import Project
from app.models.user import User

class JudgeAssignmentService:
    @staticmethod
    def assign_judge(judge_id, project_id, event_id):
        project = db.session.get(Project, project_id)
        if not project:
            return None, 'Project not found.'
            
        from app.models.team_member import TeamMember
        if TeamMember.query.filter_by(team_id=project.team_id, user_id=judge_id).first():
            return None, 'Conflict of interest: Judge is in the project team.'
            
        existing = JudgeAssignment.query.filter_by(judge_id=judge_id, project_id=project_id).first()
        if existing:
            return None, 'Judge is already assigned to this project.'
            
        assignment = JudgeAssignment(judge_id=judge_id, project_id=project_id, event_id=event_id)
        db.session.add(assignment)
        db.session.commit()
        return assignment, None

    @staticmethod
    def get_judge_assignments(judge_id):
        return JudgeAssignment.query.filter_by(judge_id=judge_id).all()
