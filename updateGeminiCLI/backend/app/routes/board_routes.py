from flask import Blueprint, request, jsonify
from ..models import Board, User, Comment
from .. import db
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('board', __name__, url_prefix='/boards')

def serialize_comment(comment):
    """ Helper function to serialize a comment and its replies recursively """
    return {
        'comment_id': comment.comment_id,
        'content': comment.content,
        'created_time': comment.created_time,
        'author': comment.author.nickname,
        'likes': comment.likes,
        'replies': [serialize_comment(reply) for reply in comment.replies]
    }

@bp.route('/', methods=['POST'])
@jwt_required()
def create_board():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    category = data.get('category')
    user_id = get_jwt_identity()

    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400

    new_board = Board(title=title, content=content, category=category, user_id=user_id)
    db.session.add(new_board)
    db.session.commit()

    return jsonify({'message': 'Board created successfully', 'board_id': new_board.board_id}), 201

@bp.route('/', methods=['GET'])
def get_boards():
    boards = Board.query.all()
    output = []
    for board in boards:
        board_data = {
            'board_id': board.board_id,
            'title': board.title,
            'content': board.content,
            'created_at': board.created_at,
            'author': board.author.nickname,
            'like_count': board.like_count,
            'comment_count': board.comment_count
        }
        output.append(board_data)
    return jsonify({'boards': output})

@bp.route('/<int:board_id>', methods=['GET'])
def get_board(board_id):
    board = Board.query.get_or_404(board_id)
    
    # Fetch only top-level comments
    comments = Comment.query.filter_by(board_id=board.board_id, parent_comment=None).all()
    
    board_data = {
        'board_id': board.board_id,
        'title': board.title,
        'content': board.content,
        'created_at': board.created_at,
        'author': board.author.nickname,
        'like_count': board.like_count,
        'comment_count': board.comment_count,
        'comments': [serialize_comment(comment) for comment in comments]
    }
    return jsonify({'board': board_data})

@bp.route('/<int:board_id>', methods=['PUT'])
@jwt_required()
def update_board(board_id):
    board = Board.query.get_or_404(board_id)
    user_id = get_jwt_identity()

    if board.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    board.title = data.get('title', board.title)
    board.content = data.get('content', board.content)
    board.category = data.get('category', board.category)
    
    db.session.commit()
    return jsonify({'message': 'Board updated successfully'})

@bp.route('/<int:board_id>', methods=['DELETE'])
@jwt_required()
def delete_board(board_id):
    board = Board.query.get_or_404(board_id)
    user_id = get_jwt_identity()

    if board.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(board)
    db.session.commit()
    return jsonify({'message': 'Board deleted successfully'})
