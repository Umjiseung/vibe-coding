from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import db, User
from datetime import datetime, timedelta
import secrets

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': '이미 존재하는 이메일입니다'}), 400
    
    if User.query.filter_by(nickname=data['nickname']).first():
        return jsonify({'message': '이미 존재하는 닉네임입니다'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    
    new_user = User(
        email=data['email'],
        nickname=data['nickname'],
        password=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': '회원가입이 완료되었습니다'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': '이메일 또는 비밀번호가 올바르지 않습니다'}), 401
    
    access_token = create_access_token(identity=user.user_id)
    
    return jsonify({
        'access_token': access_token,
        'user': {
            'user_id': user.user_id,
            'email': user.email,
            'nickname': user.nickname
        }
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'message': '해당 이메일로 등록된 사용자가 없습니다'}), 404
    
    reset_token = secrets.token_urlsafe(32)
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    db.session.commit()
    
    # TODO: 이메일 발송 구현
    print(f"비밀번호 재설정 링크: http://localhost:3000/reset-password?token={reset_token}")
    
    return jsonify({'message': '비밀번호 재설정 이메일을 발송했습니다'}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    user = User.query.filter_by(reset_token=data['token']).first()
    
    if not user or user.reset_token_expires < datetime.utcnow():
        return jsonify({'message': '유효하지 않거나 만료된 토큰입니다'}), 400
    
    user.password = generate_password_hash(data['new_password'])
    user.reset_token = None
    user.reset_token_expires = None
    db.session.commit()
    
    return jsonify({'message': '비밀번호가 재설정되었습니다'}), 200