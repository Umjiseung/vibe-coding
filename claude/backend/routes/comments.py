from flask import Blueprint, request, redirect, url_for, session, flash
from models import Comment

comments_bp = Blueprint('comments', __name__)

@comments_bp.route('/comment/<int:post_id>', methods=['POST'])
def add_comment(post_id):
    """댓글 추가"""
    if 'user' not in session:
        flash('로그인이 필요합니다.', 'error')
        return redirect(url_for('auth.login'))
    
    content = request.form.get('content')
    parent_id = request.form.get('parent_id')
    
    if not content or not content.strip():
        flash('댓글 내용을 입력해주세요.', 'error')
        return redirect(url_for('posts.view_post', post_id=post_id))
    
    parent_id = int(parent_id) if parent_id else None
    
    Comment.create(post_id, session['user'], content.strip(), parent_id)
    flash('댓글이 작성되었습니다!', 'success')
    return redirect(url_for('posts.view_post', post_id=post_id))

@comments_bp.route('/comment/delete/<int:comment_id>')
def delete_comment(comment_id):
    """댓글 삭제"""
    if 'user' not in session:
        flash('로그인이 필요합니다.', 'error')
        return redirect(url_for('auth.login'))
    
    comment = Comment.get(comment_id)
    if not comment:
        flash('존재하지 않는 댓글입니다.', 'error')
        return redirect(url_for('home'))
    
    if not Comment.is_author(comment_id, session['user']):
        flash('삭제 권한이 없습니다.', 'error')
        return redirect(url_for('posts.view_post', post_id=comment['post_id']))
    
    Comment.delete(comment_id)
    flash('댓글이 삭제되었습니다.', 'success')
    return redirect(url_for('posts.view_post', post_id=comment['post_id']))