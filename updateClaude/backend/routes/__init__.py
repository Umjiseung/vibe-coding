from flask import Blueprint

def register_routes(app):
    from .auth import auth_bp
    from .boards import boards_bp
    from .comments import comments_bp
    from .likes import likes_bp
    from .users import users_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(boards_bp, url_prefix='/api/boards')
    app.register_blueprint(comments_bp, url_prefix='/api/comments')
    app.register_blueprint(likes_bp, url_prefix='/api/likes')
    app.register_blueprint(users_bp, url_prefix='/api/users')