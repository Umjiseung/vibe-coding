from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}}, supports_credentials=True)
    jwt.init_app(app)
    mail.init_app(app)

    from .models import User, Board, Comment, Like
    
    from .routes import main_routes, auth_routes, board_routes, comment_routes, like_routes, user_routes
    app.register_blueprint(main_routes.bp)
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(board_routes.bp)
    app.register_blueprint(comment_routes.bp)
    app.register_blueprint(like_routes.bp)
    app.register_blueprint(user_routes.bp)

    return app
