from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Like, Board, Comment
from sqlalchemy import func, extract
from datetime import datetime

likes_bp = Blueprint('likes', __name__)

@likes_bp.route('/board/<int:board_id>', methods=['POST'])
@jwt_required()
def toggle_board_like(board_id):
    user_id = get_jwt_identity()
    
    existing_like = Like.query.filter_by(user_id=user_id, board_id=board_id).first()
    
    if existing_like:
        db.session.delete(existing_like)
        board = Board.query.get(board_id)
        board.like_count -= 1
        db.session.commit()
        return jsonify({'message': '좋아요가 취소되었습니다', 'liked': False}), 200
    else:
        new_like = Like(user_id=user_id, board_id=board_id)
        db.session.add(new_like)
        board = Board.query.get(board_id)
        board.like_count += 1
        db.session.commit()
        return jsonify({'message': '좋아요를 눌렀습니다', 'liked': True}), 201

@likes_bp.route('/comment/<int:comment_id>', methods=['POST'])
@jwt_required()
def toggle_comment_like(comment_id):
    user_id = get_jwt_identity()
    
    existing_like = Like.query.filter_by(user_id=user_id, comment_id=comment_id).first()
    
    if existing_like:
        db.session.delete(existing_like)
        comment = Comment.query.get(comment_id)
        comment.likes -= 1
        db.session.commit()
        return jsonify({'message': '좋아요가 취소되었습니다', 'liked': False}), 200
    else:
        new_like = Like(user_id=user_id, comment_id=comment_id)
        db.session.add(new_like)
        comment = Comment.query.get(comment_id)
        comment.likes += 1
        db.session.commit()
        return jsonify({'message': '좋아요를 눌렀습니다', 'liked': True}), 201

@likes_bp.route('/ranking/month', methods=['GET'])
def get_monthly_ranking():
    current_month = datetime.utcnow().month
    current_year = datetime.utcnow().year
    
    ranking = db.session.query(
        Board,
        func.count(Like.like_id).label('like_count')
    ).join(Like, Board.board_id == Like.board_id)\
     .filter(extract('month', Like.created_at) == current_month)\
     .filter(extract('year', Like.created_at) == current_year)\
     .group_by(Board.board_id)\
     .order_by(func.count(Like.like_id).desc())\
     .limit(10).all()
    
    return jsonify({
        'ranking': [{
            'rank': idx + 1,
            'board_id': board.board_id,
            'title': board.title,
            'author': board.author.nickname,
            'like_count': like_count
        } for idx, (board, like_count) in enumerate(ranking)]
    }), 200