from flask import Blueprint, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        password_confirm = request.form['password_confirm']
        
        if User.exists(username):
            flash('이미 존재하는 아이디입니다.', 'error')
            return redirect(url_for('auth.register'))
        
        if password != password_confirm:
            flash('비밀번호가 일치하지 않습니다.', 'error')
            return redirect(url_for('auth.register'))
        
        User.create(username, generate_password_hash(password))
        flash('회원가입이 완료되었습니다!', 'success')
        return redirect(url_for('auth.login'))
    
    return render_template('register.html')

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.get(username)
        if user and check_password_hash(user['password'], password):
            session['user'] = username
            flash('로그인되었습니다!', 'success')
            return redirect(url_for('home'))
        else:
            flash('아이디 또는 비밀번호가 올바르지 않습니다.', 'error')
    
    return render_template('login.html')

@auth_bp.route('/logout')
def logout():
    session.pop('user', None)
    flash('로그아웃되었습니다.', 'success')
    return redirect(url_for('home'))
