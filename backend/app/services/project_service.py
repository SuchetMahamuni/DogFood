from datetime import datetime
from app.extensions import db
from app.models.project import Project
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.event import Event

class ProjectService:
    @staticmethod
    def create_project(team_id, user_id, data):
        team = db.session.get(Team, team_id)
        if not team:
            return None, 'Team not found.'
            
        # Check if user is in team
        member = TeamMember.query.filter_by(team_id=team_id, user_id=user_id).first()
        if not member:
            return None, 'You are not a member of this team.'
            
        if team.project:
            return None, 'Team already has a project.'
            
        project = Project(team_id=team_id, **data)
        db.session.add(project)
        db.session.commit()
        return project, None
        
    @staticmethod
    def get_project(project_id):
        return db.session.get(Project, project_id)
        
    @staticmethod
    def update_project(project_id, user_id, data):
        project = db.session.get(Project, project_id)
        if not project:
            return None, 'Project not found.'
            
        # Check if user is in team
        member = TeamMember.query.filter_by(team_id=project.team_id, user_id=user_id).first()
        if not member:
            return None, 'You do not have permission to edit this project.'
            
        if project.is_submitted:
            return None, 'Project has already been submitted and cannot be edited.'
            
        for key, value in data.items():
            if hasattr(project, key):
                setattr(project, key, value)
                
        db.session.commit()
        return project, None
        
    @staticmethod
    def submit_project(project_id, user_id):
        project = db.session.get(Project, project_id)
        if not project:
            return False, 'Project not found.'
            
        member = TeamMember.query.filter_by(team_id=project.team_id, user_id=user_id).first()
        if not member:
            return False, 'You do not have permission to submit this project.'
            
        if project.is_submitted:
            return False, 'Project has already been submitted.'
            
        # Check deadline
        event = project.team.event
        if datetime.utcnow() > event.submission_deadline:
            return False, 'Submission deadline has passed.'
            
        project.is_submitted = True
        project.submitted_at = datetime.utcnow()
        
        from app.services.audit_service import AuditService
        AuditService.log_action(user_id, 'PROJECT_SUBMIT', 'Project', project_id)
        
        db.session.commit()
        return True, None
        
    @staticmethod
    def get_event_projects(event_id, public_only=False):
        query = Project.query.join(Team).filter(Team.event_id == event_id)
        if public_only:
             query = query.filter(Project.is_submitted == True)
        return query.all()
