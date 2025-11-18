from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from models import Post, Comment

posts_bp = Blueprint('posts', __name__)

@posts_bp.route('/write', methods=['GET', 'POST'])
def write():
    if 'user' not in session:
        flash('로그인이 필요합니다.', 'error')
        return redirect(url_for('auth.login'))
    
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        Post.create(title, content, session['user'])
        flash('글이 작성되었습니다!', 'success')
        return redirect(url_for('home'))
    
    return render_template('write.html')

@posts_bp.route('/post/<int:post_id>')
def view_post(post_id):
    post = Post.get(post_id)
    if not post:
        flash('존재하지 않는 글입니다.', 'error')
        return redirect(url_for('home'))
    
    comments = Comment.get_by_post(post_id)
    return render_template('post.html', post=post, comments=comments)

@posts_bp.route('/edit/<int:post_id>', methods=['GET', 'POST'])
def edit_post(post_id):
    if 'user' not in session:
        flash('로그인이 필요합니다.', 'error')
        return redirect(url_for('auth.login'))
    
    post = Post.get(post_id)
    if not post:
        flash('존재하지 않는 글입니다.', 'error')
        return redirect(url_for('home'))
    
    if not Post.is_author(post_id, session['user']):
        flash('수정 권한이 없습니다.', 'error')
        return redirect(url_for('home'))
    
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']
        Post.update(post_id, title, content)
        flash('글이 수정되었습니다!', 'success')
        return redirect(url_for('posts.view_post', post_id=post_id))
    
    return render_template('edit.html', post=post)

@posts_bp.route('/delete/<int:post_id>')
def delete_post(post_id):
    if 'user' not in session:
        flash('로그인이 필요합니다.', 'error')
        return redirect(url_for('auth.login'))
    
    post = Post.get(post_id)
    if not post:
        flash('존재하지 않는 글입니다.', 'error')
        return redirect(url_for('home'))
    
    if not Post.is_author(post_id, session['user']):
        flash('삭제 권한이 없습니다.', 'error')
        return redirect(url_for('home'))
    
    Post.delete(post_id)
    flash('글이 삭제되었습니다.', 'success')
    return redirect(url_for('home'))