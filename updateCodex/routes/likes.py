from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Like, Board, Comment
from datetime import datetime

likes_bp = Blueprint('likes', __name__)


@likes_bp.route('/toggle', methods=['POST'])
@jwt_required()
def toggle_like():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    board_id = data.get('board_id')
    comment_id = data.get('comment_id')
    if not (board_id or comment_id):
        return jsonify({'msg': 'provide board_id or comment_id'}), 400

    existing = Like.query.filter_by(user_id=user_id, board_id=board_id, comment_id=comment_id).first()
    if existing:
        # unlike
        db.session.delete(existing)
        if board_id:
            b = Board.query.get(board_id)
            if b:
                b.like_count = (b.like_count or 0) - 1
        if comment_id:
            c = Comment.query.get(comment_id)
            if c:
                c.likes = (c.likes or 0) - 1
        db.session.commit()
        return jsonify({'msg': 'unliked'})
    else:
        like = Like(user_id=user_id, board_id=board_id, comment_id=comment_id, created_at=datetime.utcnow())
        db.session.add(like)
        if board_id:
            b = Board.query.get(board_id)
            if b:
                b.like_count = (b.like_count or 0) + 1
        if comment_id:
            c = Comment.query.get(comment_id)
            if c:
                c.likes = (c.likes or 0) + 1
        db.session.commit()
        return jsonify({'msg': 'liked'})


@likes_bp.route('/monthly-ranking', methods=['GET'])
def monthly_ranking():
    # Return top N boards by likes this month
    from datetime import datetime
    now = datetime.utcnow()
    month_start = datetime(now.year, now.month, 1)
    # join Like -> Board and group by board_id
    results = db.session.query(Board.board_id, Board.title, db.func.count(Like.like_id).label('likes'))\
        .join(Like, Like.board_id == Board.board_id)\
        .filter(Like.created_at >= month_start)\
        .group_by(Board.board_id)\
        .order_by(db.desc('likes'))\
        .limit(10).all()
    items = [{'board_id': r.board_id, 'title': r.title, 'likes': int(r.likes)} for r in results]
    return jsonify({'items': items})
