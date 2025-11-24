from flask import Blueprint, request, jsonify
from ..models import User
from .. import db, mail
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from flask_mail import Message
import secrets
from datetime import datetime, timedelta

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    nickname = data.get('nickname')

    if not email or not password or not nickname:
        return jsonify({'error': 'Email, password and nickname are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    new_user = User(email=email, nickname=nickname, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=user.user_id)
    return jsonify(access_token=access_token)

@bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()

    if user:
        token = secrets.token_urlsafe(32)
        user.reset_token = token
        user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        db.session.commit()

        # This link should point to your frontend application
        reset_link = f"http://localhost:3000/reset-password?token={token}"
        msg = Message('Password Reset Request',
                      sender='your-email@example.com',
                      recipients=[user.email])
        msg.body = f'To reset your password, visit the following link: {reset_link}'
        mail.send(msg)

    # Always return a success message to prevent user enumeration
    return jsonify({'message': 'If an account with that email exists, a password reset link has been sent.'}), 200

@bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')

    if not token or not new_password:
        return jsonify({'error': 'Token and new password are required'}), 400

    user = User.query.filter_by(reset_token=token).first()

    if user and user.reset_token_expires > datetime.utcnow():
        user.password = generate_password_hash(new_password, method='pbkdf2:sha256')
        user.reset_token = None
        user.reset_token_expires = None
        db.session.commit()
        return jsonify({'message': 'Password has been reset successfully'}), 200
    else:
        return jsonify({'error': 'Invalid or expired token'}), 400
