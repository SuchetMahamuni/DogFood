import sys
import os
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.profile import Profile
from app.models.event import Event
from app.models.track import Track
from app.models.team import Team
from app.models.team_member import TeamMember
from app.models.project import Project
from app.models.rubric import Rubric
from app.models.criterion import Criterion
from app.models.judge_assignment import JudgeAssignment
from app.models.score import Score
from app.models.guidance_resource import GuidanceResource
from app.utils.security import hash_password
from datetime import datetime, timedelta

def seed_database():
    app = create_app()
    with app.app_context():
        # Clear existing data (since this is just a seed script for dev)
        db.drop_all()
        db.create_all()
        
        # 1. Users
        admin = User(name='Admin', email='admin@example.com', password_hash=hash_password('password123'), role='ADMIN')
        organizer = User(name='Organizer', email='organizer@example.com', password_hash=hash_password('password123'), role='ORGANIZER')
        judge1 = User(name='Judge One', email='judge1@example.com', password_hash=hash_password('password123'), role='JUDGE')
        judge2 = User(name='Judge Two', email='judge2@example.com', password_hash=hash_password('password123'), role='JUDGE')
        part1 = User(name='Participant 1', email='participant1@example.com', password_hash=hash_password('password123'), role='PARTICIPANT')
        part2 = User(name='Participant 2', email='participant2@example.com', password_hash=hash_password('password123'), role='PARTICIPANT')
        
        db.session.add_all([admin, organizer, judge1, judge2, part1, part2])
        db.session.commit()
        
        # Profiles
        for u in [admin, organizer, judge1, judge2, part1, part2]:
            db.session.add(Profile(user_id=u.id, display_name=u.name, skills='Python,Flask', interests='Backend'))
        db.session.commit()

        # 2. Event
        event = Event(
            name='DogFood Hackathon 2026',
            description='The best hackathon ever.',
            start_time=datetime.utcnow() - timedelta(days=1),
            end_time=datetime.utcnow() + timedelta(days=2),
            submission_deadline=datetime.utcnow() + timedelta(days=2),
            status='LIVE'
        )
        db.session.add(event)
        db.session.commit()
        
        # 3. Tracks
        track1 = Track(event_id=event.id, name='AI / ML', description='Build AI tools')
        track2 = Track(event_id=event.id, name='Web3', description='Build decentralized apps')
        db.session.add_all([track1, track2])
        db.session.commit()
        
        # 4. Teams & Projects
        team1 = Team(event_id=event.id, name='Team Alpha')
        db.session.add(team1)
        db.session.commit()
        
        db.session.add(TeamMember(team_id=team1.id, user_id=part1.id, role='LEADER'))
        db.session.add(TeamMember(team_id=team1.id, user_id=part2.id, role='MEMBER'))
        
        project1 = Project(team_id=team1.id, track_id=track1.id, title='AI Project', is_submitted=True, submitted_at=datetime.utcnow())
        db.session.add(project1)
        db.session.commit()
        
        # 5. Rubrics & Criteria
        rubric = Rubric(event_id=event.id, name='Standard Rubric', description='Standard criteria')
        db.session.add(rubric)
        db.session.commit()
        
        c1 = Criterion(rubric_id=rubric.id, name='Innovation', weight=1.0)
        c2 = Criterion(rubric_id=rubric.id, name='Technical Difficulty', weight=1.5)
        db.session.add_all([c1, c2])
        db.session.commit()
        
        # 6. Judge Assignments & Scores
        ja = JudgeAssignment(judge_id=judge1.id, project_id=project1.id, event_id=event.id, status='SCORED')
        db.session.add(ja)
        db.session.commit()
        
        db.session.add(Score(assignment_id=ja.id, judge_id=judge1.id, project_id=project1.id, criterion_id=c1.id, value=8.0))
        db.session.add(Score(assignment_id=ja.id, judge_id=judge1.id, project_id=project1.id, criterion_id=c2.id, value=7.5))
        db.session.commit()
        
        # 7. Guidance Resources
        gr = GuidanceResource(
            title='Flask for Beginners',
            topic='Backend',
            skill='Flask',
            stage='DEVELOPMENT',
            url='https://flask.palletsprojects.com/'
        )
        db.session.add(gr)
        db.session.commit()
        
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
