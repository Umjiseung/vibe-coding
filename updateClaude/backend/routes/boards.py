from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Board, Comment, Like, CATEGORIES
from datetime import datetime

boards_bp = Blueprint('boards', __name__)

# 카테고리 목록 반환 API 추가
@boards_bp.route('/categories', methods=['GET'])
def get_categories():
    return jsonify({'categories': CATEGORIES}), 200

@boards_bp.route('', methods=['POST'])
@jwt_required()
def create_board():
    user_id = get_jwt_identity()
    data = request.json
    
    # 카테고리 유효성 검사
    category = data.get('category', '기타')
    if category not in CATEGORIES:
        return jsonify({'message': f'유효하지 않은 카테고리입니다. 선택 가능: {", ".join(CATEGORIES)}'}), 400
    
    new_board = Board(
        user_id=user_id,
        title=data['title'],
        content=data['content'],
        category=category
    )
    
    db.session.add(new_board)
    db.session.commit()
    
    return jsonify({'message': '블로그가 작성되었습니다', 'board_id': new_board.board_id}), 201

@boards_bp.route('', methods=['GET'])
def get_boards():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    category = request.args.get('category')
    
    query = Board.query
    if category and category in CATEGORIES:
        query = query.filter_by(category=category)
    
    boards = query.order_by(Board.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'boards': [{
            'board_id': b.board_id,
            'title': b.title,
            'content': b.content[:100] + '...' if len(b.content) > 100 else b.content,
            'author': b.author.nickname,
            'created_at': b.created_at.isoformat(),
            'comment_count': b.comment_count,
            'like_count': b.like_count,
            'category': b.category
        } for b in boards.items],
        'total': boards.total,
        'pages': boards.pages,
        'current_page': page
    }), 200

@boards_bp.route('/<int:board_id>', methods=['GET'])
@jwt_required(optional=True)
def get_board_detail(board_id):
    board = Board.query.get_or_404(board_id)
    
    current_user_id = get_jwt_identity()
    
    is_liked = False
    if current_user_id:
        is_liked = Like.query.filter_by(
            user_id=current_user_id, 
            board_id=board_id
        ).first() is not None
    
    comments = Comment.query.filter_by(board_id=board_id, parent_comment=None).order_by(Comment.created_time.asc()).all()
    
    def format_comment(comment):
        comment_is_liked = False
        if current_user_id:
            comment_is_liked = Like.query.filter_by(
                user_id=current_user_id,
                comment_id=comment.comment_id
            ).first() is not None
        
        return {
            'comment_id': comment.comment_id,
            'content': comment.content,
            'author': comment.author.nickname,
            'user_id': comment.user_id,
            'likes': comment.likes,
            'is_liked': comment_is_liked,
            'created_time': comment.created_time.isoformat(),
            'replies': [format_comment(reply) for reply in comment.replies]
        }
    
    return jsonify({
        'board_id': board.board_id,
        'title': board.title,
        'content': board.content,
        'author': board.author.nickname,
        'author_id': board.user_id,
        'created_at': board.created_at.isoformat(),
        'updated_at': board.updated_at.isoformat(),
        'comment_count': board.comment_count,
        'like_count': board.like_count,
        'category': board.category,
        'is_liked': is_liked,
        'comments': [format_comment(c) for c in comments]
    }), 200

@boards_bp.route('/<int:board_id>', methods=['PUT'])
@jwt_required()
def update_board(board_id):
    user_id = get_jwt_identity()
    board = Board.query.get_or_404(board_id)
    
    if board.user_id != user_id:
        return jsonify({'message': '권한이 없습니다'}), 403
    
    data = request.json
    
    # 카테고리 유효성 검사
    if 'category' in data and data['category'] not in CATEGORIES:
        return jsonify({'message': f'유효하지 않은 카테고리입니다. 선택 가능: {", ".join(CATEGORIES)}'}), 400
    
    board.title = data.get('title', board.title)
    board.content = data.get('content', board.content)
    board.category = data.get('category', board.category)
    board.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({'message': '블로그가 수정되었습니다'}), 200

@boards_bp.route('/<int:board_id>', methods=['DELETE'])
@jwt_required()
def delete_board(board_id):
    user_id = get_jwt_identity()
    board = Board.query.get_or_404(board_id)
    
    if board.user_id != user_id:
        return jsonify({'message': '권한이 없습니다'}), 403
    
    db.session.delete(board)
    db.session.commit()
    
    return jsonify({'message': '블로그가 삭제되었습니다'}), 200