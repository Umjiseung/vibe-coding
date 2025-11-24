from flask import Blueprint, request, jsonify
from ..models import Like, Board, Comment
from .. import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from sqlalchemy import extract

bp = Blueprint('like', __name__, url_prefix='/like')

@bp.route('/board/<int:board_id>', methods=['POST'])
@jwt_required()
def like_board(board_id):
    user_id = get_jwt_identity()
    
    board = Board.query.get_or_404(board_id)
    like = Like.query.filter_by(user_id=user_id, board_id=board_id).first()

    if like:
        # Unlike
        db.session.delete(like)
        board.like_count -= 1
        db.session.commit()
        return jsonify({'message': 'Board unliked successfully'}), 200
    else:
        # Like
        new_like = Like(user_id=user_id, board_id=board_id)
        db.session.add(new_like)
        board.like_count += 1
        db.session.commit()
        return jsonify({'message': 'Board liked successfully'}), 200

@bp.route('/comment/<int:comment_id>', methods=['POST'])
@jwt_required()
def like_comment(comment_id):
    user_id = get_jwt_identity()

    comment = Comment.query.get_or_404(comment_id)
    like = Like.query.filter_by(user_id=user_id, comment_id=comment_id).first()

    if like:
        # Unlike
        db.session.delete(like)
        comment.likes -= 1
        db.session.commit()
        return jsonify({'message': 'Comment unliked successfully'}), 200
    else:
        # Like
        new_like = Like(user_id=user_id, comment_id=comment_id)
        db.session.add(new_like)
        comment.likes += 1
        db.session.commit()
        return jsonify({'message': 'Comment liked successfully'}), 200

@bp.route('/ranking', methods=['GET'])
def get_monthly_ranking():
    current_month = datetime.utcnow().month
    current_year = datetime.utcnow().year
    
    ranked_boards = Board.query.filter(
        extract('year', Board.created_at) == current_year,
        extract('month', Board.created_at) == current_month
    ).order_by(Board.like_count.desc()).limit(10).all()

    output = []
    for board in ranked_boards:
        board_data = {
            'board_id': board.board_id,
            'title': board.title,
            'author': board.author.nickname,
            'like_count': board.like_count,
        }
        output.append(board_data)
        
    return jsonify({'ranking': output})
