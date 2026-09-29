from flask import Flask
from app.config import Config
from app.extensions import db, migrate
from flask_cors import CORS

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from app.routes.health import health_bp
    from app.routes.auth import auth_bp
    from app.routes.events import events_bp
    from app.routes.teams import teams_bp
    from app.routes.projects import projects_bp
    from app.routes.users import users_bp
    from app.routes.guidance import guidance_bp
    from app.routes.judging import judging_bp
    app.register_blueprint(health_bp, url_prefix='/')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(events_bp, url_prefix='/api/events')
    app.register_blueprint(teams_bp, url_prefix='/api')
    app.register_blueprint(projects_bp, url_prefix='/api')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(guidance_bp, url_prefix='/api')
    app.register_blueprint(judging_bp, url_prefix='/api/judging')

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": app.config["FRONTEND_URL"]
            }
        },
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )


    return app
