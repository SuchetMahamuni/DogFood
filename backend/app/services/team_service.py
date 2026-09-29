from app.extensions import db
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.team_invitation import TeamInvitation
from app.models.event import Event
from app.models.user import User

class TeamService:
    @staticmethod
    def create_team(event_id, creator_id, name):
        event = db.session.get(Event, event_id)
        if not event or event.status not in ['UPCOMING', 'LIVE']:
            return None, 'Event not found or not open for team creation.'
            
        # Check if user is already in a team for this event
        existing = TeamMember.query.join(Team).filter(Team.event_id == event_id, TeamMember.user_id == creator_id).first()
        if existing:
            return None, 'You are already in a team for this event.'
            
        team = Team(event_id=event_id, name=name)
        db.session.add(team)
        db.session.flush()
        
        member = TeamMember(team_id=team.id, user_id=creator_id, role='LEADER')
        db.session.add(member)
        db.session.commit()
        return team, None
        
    @staticmethod
    def get_team(team_id):
        return db.session.get(Team, team_id)
        
    @staticmethod
    def invite_member(team_id, inviter_id, invitee_id):
        team = db.session.get(Team, team_id)
        if not team:
            return None, 'Team not found.'
            
        # Check if inviter is in the team
        inviter_member = TeamMember.query.filter_by(team_id=team_id, user_id=inviter_id).first()
        if not inviter_member:
            return None, 'You are not a member of this team.'
            
        # Check if invitee is already in a team for this event
        existing_member = TeamMember.query.join(Team).filter(Team.event_id == team.event_id, TeamMember.user_id == invitee_id).first()
        if existing_member:
            return None, 'Invitee is already in a team for this event.'
            
        # Check if pending invite exists
        existing_invite = TeamInvitation.query.filter_by(team_id=team_id, invitee_id=invitee_id, status='PENDING').first()
        if existing_invite:
            return None, 'A pending invitation already exists for this user.'
            
        invite = TeamInvitation(team_id=team_id, inviter_id=inviter_id, invitee_id=invitee_id)
        db.session.add(invite)
        db.session.commit()
        return invite, None
        
    @staticmethod
    def accept_invitation(invitation_id, user_id):
        invite = db.session.get(TeamInvitation, invitation_id)
        if not invite or invite.invitee_id != user_id or invite.status != 'PENDING':
            return False, 'Invalid or expired invitation.'
            
        # Check event status
        if invite.team.event.status not in ['UPCOMING', 'LIVE']:
            return False, 'Event is no longer open for team changes.'
            
        # Check if user already joined another team
        existing_member = TeamMember.query.join(Team).filter(Team.event_id == invite.team.event_id, TeamMember.user_id == user_id).first()
        if existing_member:
            invite.status = 'REJECTED' # auto reject
            db.session.commit()
            return False, 'You are already in a team for this event.'
            
        invite.status = 'ACCEPTED'
        member = TeamMember(team_id=invite.team_id, user_id=user_id, role='MEMBER')
        db.session.add(member)
        db.session.commit()
        return True, None
        
    @staticmethod
    def reject_invitation(invitation_id, user_id):
        invite = db.session.get(TeamInvitation, invitation_id)
        if not invite or invite.invitee_id != user_id or invite.status != 'PENDING':
            return False, 'Invalid or expired invitation.'
            
        invite.status = 'REJECTED'
        db.session.commit()
        return True, None
        
    @staticmethod
    def leave_team(team_id, user_id):
        member = TeamMember.query.filter_by(team_id=team_id, user_id=user_id).first()
        if not member:
            return False, 'You are not a member of this team.'
            
        db.session.delete(member)
        db.session.flush()
        
        # Check if team is empty
        remaining = TeamMember.query.filter_by(team_id=team_id).count()
        if remaining == 0:
            team = db.session.get(Team, team_id)
            db.session.delete(team)
            
        db.session.commit()
        return True, None

    @staticmethod
    def get_my_invitations(user_id):
        return TeamInvitation.query.filter_by(invitee_id=user_id, status='PENDING').all()
