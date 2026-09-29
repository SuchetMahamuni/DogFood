from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.profile import Profile
from app.utils.security import hash_password

app = create_app()

with app.app_context():
    users = [
        ("admin@example.com", "Admin User", "ADMIN"),
        ("organizer@example.com", "Organizer User", "ORGANIZER"),
        ("judge1@example.com", "Judge One", "JUDGE"),
        ("judge2@example.com", "Judge Two", "JUDGE"),
        ("participant1@example.com", "Participant One", "PARTICIPANT"),
        ("participant2@example.com", "Participant Two", "PARTICIPANT")
    ]
    for email, name, role in users:
        u = User.query.filter_by(email=email).first()
        if not u:
            u = User(email=email, name=name, password_hash=hash_password("password123"), role=role)
            db.session.add(u)
            db.session.flush()
            p = Profile(
                user_id=u.id, 
                display_name=name,
                hackathons_participated=3 if role == 'PARTICIPANT' else 0,
                hackathons_won=1 if role == 'PARTICIPANT' else 0
            )
            db.session.add(p)
    db.session.commit()
    print("Users seeded!")
