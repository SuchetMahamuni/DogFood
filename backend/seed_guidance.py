from app import create_app
from app.extensions import db
from app.models.guidance_resource import GuidanceResource

app = create_app()

with app.app_context():
    resources = [
        GuidanceResource(
            title='Hackathon Ideation & Rapid Value Discovery',
            description='Frameworks to brainstorm, validate, and narrow down hackathon ideas within the first 4 hours.',
            topic='Ideation',
            skill='Product Strategy',
            stage='IDEATION',
            difficulty='Beginner',
            url='https://dogfood.dev/guides/ideation',
            duration='15 min read',
            source='DogFood Team'
        ),
        GuidanceResource(
            title='Fast-Track API Prototyping with Flask & React',
            description='Setting up schema validation, JWT auth, and Axios client interceptors in under 30 minutes.',
            topic='Architecture',
            skill='Python, TypeScript',
            stage='DEVELOPMENT',
            difficulty='Intermediate',
            url='https://dogfood.dev/guides/flask-react-stack',
            duration='25 min tutorial',
            source='Dev Community'
        ),
        GuidanceResource(
            title='Stress-Testing & Demo Resilience Checklist',
            description='Ensure your app works seamlessly during live demos without getting tripped up by network latency.',
            topic='Testing',
            skill='QA & Reliability',
            stage='TESTING',
            difficulty='Intermediate',
            url='https://dogfood.dev/guides/demo-testing',
            duration='12 min read',
            source='DogFood Team'
        )
    ]
    db.session.bulk_save_objects(resources)
    db.session.commit()
    print("Guidance resources seeded realistically!")
