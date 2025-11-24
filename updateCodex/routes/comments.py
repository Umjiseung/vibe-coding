from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Comment, Board

comments_bp = Blueprint('comments', __name__)


@comments_bp.route('/', methods=['POST'])
@jwt_required()
def create_comment():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    board_id = data.get('board_id')
    content = data.get('content')
    parent_comment = data.get('parent_comment')
    if not (board_id and content):
        return jsonify({'msg': 'missing fields'}), 400
    board = Board.query.get_or_404(board_id)
    comment = Comment(user_id=user_id, board_id=board_id, content=content, parent_comment=parent_comment)
    db.session.add(comment)
    board.comment_count = (board.comment_count or 0) + 1
    db.session.commit()
    return jsonify({'msg': 'created', 'comment_id': comment.comment_id}), 201
