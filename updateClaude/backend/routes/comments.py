from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Comment, Board

comments_bp = Blueprint('comments', __name__)

@comments_bp.route('', methods=['POST'])
@jwt_required()
def create_comment():
    user_id = get_jwt_identity()
    data = request.json
    
    new_comment = Comment(
        user_id=user_id,
        board_id=data['board_id'],
        content=data['content'],
        parent_comment=data.get('parent_comment')
    )
    
    db.session.add(new_comment)
    
    # 댓글 수 업데이트
    board = Board.query.get(data['board_id'])
    board.comment_count += 1
    
    db.session.commit()
    
    return jsonify({'message': '댓글이 작성되었습니다', 'comment_id': new_comment.comment_id}), 201
