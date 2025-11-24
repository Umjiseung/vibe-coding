from flask import Blueprint, request, jsonify, current_app
from extensions import db, mail
from models import User
from passlib.hash import bcrypt
from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta
from flask_mail import Message
import secrets

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    nickname = data.get('nickname')
    password = data.get('password')
    if not (email and nickname and password):
        return jsonify({'msg': 'missing fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'email exists'}), 400

    hashed = bcrypt.hash(password)
    user = User(email=email, nickname=nickname, password=hashed)
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'registered'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not (email and password):
        return jsonify({'msg': 'missing'}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.verify(password, user.password):
        return jsonify({'msg': 'invalid credentials'}), 401

    token = create_access_token(identity=user.user_id)
    return jsonify({'access_token': token, 'user': {'user_id': user.user_id, 'email': user.email, 'nickname': user.nickname}})


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'msg': 'no user'}), 404
    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    db.session.commit()

    # If mail is configured, send the reset link via email. Otherwise return token in response.
    try:
        if current_app.config.get('MAIL_SERVER'):
            reset_url = f"{request.host_url.rstrip('/')}/reset-password?token={token}"
            msg = Message(subject='Password reset', recipients=[user.email])
            msg.body = f"Use this token to reset your password: {token}\nOr visit: {reset_url}\nThis token expires in 1 hour."
            mail.send(msg)
            return jsonify({'msg': 'reset email sent'}), 200
    except Exception:
        # If sending email fails, fall back to returning the token (useful for dev)
        current_app.logger.exception('Failed to send reset email')

    return jsonify({'reset_token': token})


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json() or {}
    token = data.get('token')
    new_password = data.get('new_password')
    user = User.query.filter_by(reset_token=token).first()
    if not user:
        return jsonify({'msg': 'invalid token'}), 400
    if user.reset_token_expires is None or user.reset_token_expires < datetime.utcnow():
        return jsonify({'msg': 'token expired'}), 400
    user.password = bcrypt.hash(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.session.commit()
    return jsonify({'msg': 'password reset'})
