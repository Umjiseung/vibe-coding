from flask import Flask, jsonify
from config import Config
from extensions import db, migrate, jwt, mail
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    CORS(app)

    # register blueprints
    from routes.auth import auth_bp
    from routes.boards import boards_bp
    from routes.comments import comments_bp
    from routes.likes import likes_bp
    from routes.users import users_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(boards_bp, url_prefix='/api/boards')
    app.register_blueprint(comments_bp, url_prefix='/api/comments')
    app.register_blueprint(likes_bp, url_prefix='/api/likes')
    app.register_blueprint(users_bp, url_prefix='/api/users')

    @app.route('/health')
    def health():
        return jsonify({'status': 'ok'})

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
