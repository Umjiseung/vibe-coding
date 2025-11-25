from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Board, Comment, Like, User

boards_bp = Blueprint('boards', __name__)


@boards_bp.route('/', methods=['POST'])
@jwt_required()
def create_board():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    title = data.get('title')
    content = data.get('content')
    category = data.get('category')
    if not (title and content):
        return jsonify({'msg': 'missing fields'}), 400
    board = Board(user_id=user_id, title=title, content=content, category=category)
    db.session.add(board)
    db.session.commit()
    return jsonify({'msg': 'created', 'board_id': board.board_id}), 201


@boards_bp.route('/', methods=['GET'])
def list_boards():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    q = Board.query.order_by(Board.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    items = []
    for b in q.items:
        items.append({
            'board_id': b.board_id,
            'title': b.title,
            'content': b.content,
            'created_at': b.created_at.isoformat(),
            'like_count': b.like_count,
            'comment_count': b.comment_count,
            'user_id': b.user_id,
            'nickname': b.author.nickname if b.author else None,
        })
    return jsonify({'items': items, 'total': q.total})


@boards_bp.route('/<int:board_id>', methods=['GET'])
def get_board(board_id):
    b = Board.query.get_or_404(board_id)
    comments = []
    for c in b.comments:
        comments.append({'comment_id': c.comment_id, 'content': c.content, 'user_id': c.user_id, 'parent': c.parent_comment})
    return jsonify({
        'board_id': b.board_id,
        'title': b.title,
        'content': b.content,
        'created_at': b.created_at.isoformat(),
        'updated_at': b.updated_at.isoformat(),
        'comments': comments,
        'like_count': b.like_count,
        'comment_count': b.comment_count,
    })


@boards_bp.route('/<int:board_id>', methods=['PUT'])
@jwt_required()
def update_board(board_id):
    user_id = int(get_jwt_identity())
    b = Board.query.get_or_404(board_id)
    if b.user_id != user_id:
        return jsonify({'msg': 'forbidden'}), 403
    data = request.get_json() or {}
    b.title = data.get('title', b.title)
    b.content = data.get('content', b.content)
    b.category = data.get('category', b.category)
    db.session.commit()
    return jsonify({'msg': 'updated'})


@boards_bp.route('/<int:board_id>', methods=['DELETE'])
@jwt_required()
def delete_board(board_id):
    user_id = int(get_jwt_identity())
    b = Board.query.get_or_404(board_id)
    if b.user_id != user_id:
        return jsonify({'msg': 'forbidden'}), 403
    db.session.delete(b)
    db.session.commit()
    return jsonify({'msg': 'deleted'})
