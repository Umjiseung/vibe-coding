from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Board

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_info():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    return jsonify({
        'user_id': user.user_id,
        'email': user.email,
        'nickname': user.nickname,
        'created_at': user.create_at.isoformat(),
        'board_count': len(user.boards)
    }), 200

@users_bp.route('/me/boards', methods=['GET'])
@jwt_required()
def get_my_boards():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    boards = Board.query.filter_by(user_id=user_id)\
                        .order_by(Board.created_at.desc())\
                        .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'boards': [{
            'board_id': b.board_id,
            'title': b.title,
            'content': b.content[:100] + '...' if len(b.content) > 100 else b.content,
            'created_at': b.created_at.isoformat(),
            'comment_count': b.comment_count,
            'like_count': b.like_count,
            'category': b.category
        } for b in boards.items],
        'total': boards.total,
        'pages': boards.pages,
        'current_page': page
    }), 200