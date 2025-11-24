from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Board

users_bp = Blueprint('users', __name__)


@users_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    u = User.query.get_or_404(user_id)
    return jsonify({'user_id': u.user_id, 'email': u.email, 'nickname': u.nickname, 'create_at': u.create_at.isoformat()})


@users_bp.route('/my-boards', methods=['GET'])
@jwt_required()
def my_boards():
    user_id = get_jwt_identity()
    boards = Board.query.filter_by(user_id=user_id).order_by(Board.created_at.desc()).all()
    items = [{'board_id': b.board_id, 'title': b.title, 'created_at': b.created_at.isoformat()} for b in boards]
    return jsonify({'items': items})
