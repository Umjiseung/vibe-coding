from flask import Blueprint, jsonify
from ..models import User
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('user', __name__, url_prefix='/user')

@bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    user_data = {
        'user_id': user.user_id,
        'email': user.email,
        'nickname': user.nickname,
        'create_at': user.create_at
    }
    
    return jsonify({'user': user_data})

@bp.route('/me/boards', methods=['GET'])
@jwt_required()
def get_my_boards():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    output = []
    for board in user.boards:
        board_data = {
            'board_id': board.board_id,
            'title': board.title,
            'created_at': board.created_at,
            'like_count': board.like_count,
            'comment_count': board.comment_count
        }
        output.append(board_data)
        
    return jsonify({'boards': output})
