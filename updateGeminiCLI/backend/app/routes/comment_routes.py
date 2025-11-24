from flask import Blueprint, request, jsonify
from ..models import Comment, Board
from .. import db
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('comment', __name__, url_prefix='/comments')

@bp.route('/<int:board_id>', methods=['POST'])
@jwt_required()
def create_comment(board_id):
    data = request.get_json()
    content = data.get('content')
    parent_comment = data.get('parent_comment')
    user_id = get_jwt_identity()

    if not content:
        return jsonify({'error': 'Content is required'}), 400

    board = Board.query.get_or_404(board_id)
    
    new_comment = Comment(
        content=content,
        user_id=user_id,
        board_id=board.board_id,
        parent_comment=parent_comment
    )
    
    board.comment_count += 1
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({'message': 'Comment created successfully'}), 201
