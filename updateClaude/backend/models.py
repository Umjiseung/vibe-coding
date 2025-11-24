from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    user_id = db.Column(db.BigInteger, primary_key=True, autoincrement=True)
    email = db.Column(db.String(30), nullable=False, unique=True)
    nickname = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    create_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expires = db.Column(db.DateTime, nullable=True)
    
    boards = db.relationship('Board', backref='author', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='author', lazy=True, cascade='all, delete-orphan')
    likes = db.relationship('Like', backref='user', lazy=True, cascade='all, delete-orphan')

class Board(db.Model):
    __tablename__ = 'board'
    board_id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('user.user_id'), nullable=False)
    title = db.Column(db.String(20), nullable=False)
    content = db.Column(db.String(300), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    comment_count = db.Column(db.Integer, default=0)
    like_count = db.Column(db.Integer, default=0)
    category = db.Column(db.String(20), nullable=True)
    
    comments = db.relationship('Comment', backref='board', lazy=True, cascade='all, delete-orphan')
    likes = db.relationship('Like', backref='board', lazy=True, cascade='all, delete-orphan')

class Comment(db.Model):
    __tablename__ = 'comment'
    comment_id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('user.user_id'), nullable=False)
    board_id = db.Column(db.BigInteger, db.ForeignKey('board.board_id'), nullable=False)
    content = db.Column(db.String(200), nullable=False)
    likes = db.Column(db.Integer, default=0)
    parent_comment = db.Column(db.BigInteger, db.ForeignKey('comment.comment_id'), nullable=True)
    created_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[comment_id]), lazy=True)

class Like(db.Model):
    __tablename__ = 'like'
    like_id = db.Column(db.BigInteger, primary_key=True)
    user_id = db.Column(db.BigInteger, db.ForeignKey('user.user_id'), nullable=False)
    board_id = db.Column(db.BigInteger, db.ForeignKey('board.board_id'), nullable=True)
    comment_id = db.Column(db.BigInteger, db.ForeignKey('comment.comment_id'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)