from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSON_AS_ASCII'] = False

db = SQLAlchemy(app)
CORS(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'created_at': self.created_at.isoformat(),
        }


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    author = db.relationship('User', backref=db.backref('posts', lazy=True))

    def to_dict(self, include_comments=True):
        data = {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'user_id': self.user_id,
            'author': self.author.username if self.author else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_comments:
            data['comments'] = build_comment_tree(self.comments)
        return data


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    author = db.relationship('User', backref=db.backref('comments', lazy=True))
    post = db.relationship('Post', backref=db.backref('comments', lazy=True))
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]), lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'post_id': self.post_id,
            'user_id': self.user_id,
            'author': self.author.username if self.author else None,
            'parent_id': self.parent_id,
            'created_at': self.created_at.isoformat(),
        }


def build_comment_tree(comments):
    comment_map = {comment.id: {**comment.to_dict(), 'replies': []} for comment in comments}
    root_comments = []
    for comment in comments:
        if comment.parent_id and comment.parent_id in comment_map:
            comment_map[comment.parent_id]['replies'].append(comment_map[comment.id])
        else:
            root_comments.append(comment_map[comment.id])
    return sorted(root_comments, key=lambda c: c['created_at'])


@app.post('/api/register')
def register():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    if not username or not password:
        return jsonify({'error': 'Username and password are required.'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists.'}), 400
    password_hash = generate_password_hash(password)
    user = User(username=username, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully.', 'user': user.to_dict()})


@app.post('/api/login')
def login():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials.'}), 401
    return jsonify({'message': 'Login successful.', 'user': user.to_dict()})


@app.get('/api/posts')
def list_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([post.to_dict(include_comments=False) for post in posts])


@app.post('/api/posts')
def create_post():
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    content = data.get('content', '').strip()
    user_id = data.get('user_id')
    if not all([title, content, user_id]):
        return jsonify({'error': 'title, content, and user_id are required.'}), 400
    if not User.query.get(user_id):
        return jsonify({'error': 'User not found.'}), 404
    post = Post(title=title, content=content, user_id=user_id)
    db.session.add(post)
    db.session.commit()
    return jsonify({'message': 'Post created.', 'post': post.to_dict(include_comments=False)}), 201


@app.get('/api/posts/<int:post_id>')
def get_post(post_id):
    post = Post.query.get_or_404(post_id)
    return jsonify(post.to_dict())


@app.put('/api/posts/<int:post_id>')
def update_post(post_id):
    post = Post.query.get_or_404(post_id)
    data = request.get_json() or {}
    title = data.get('title')
    content = data.get('content')
    if title:
        post.title = title.strip()
    if content:
        post.content = content.strip()
    db.session.commit()
    return jsonify({'message': 'Post updated.', 'post': post.to_dict(include_comments=False)})


@app.delete('/api/posts/<int:post_id>')
def delete_post(post_id):
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post deleted.'})


@app.get('/api/posts/<int:post_id>/comments')
def post_comments(post_id):
    post = Post.query.get_or_404(post_id)
    return jsonify(build_comment_tree(post.comments))


@app.post('/api/posts/<int:post_id>/comments')
def create_comment(post_id):
    Post.query.get_or_404(post_id)
    data = request.get_json() or {}
    content = data.get('content', '').strip()
    user_id = data.get('user_id')
    parent_id = data.get('parent_id')
    if not content:
        return jsonify({'error': 'content is required.'}), 400
    if not user_id or not User.query.get(user_id):
        return jsonify({'error': 'Valid user_id is required.'}), 400
    if parent_id:
        parent = Comment.query.filter_by(id=parent_id, post_id=post_id).first()
        if not parent:
            return jsonify({'error': 'Parent comment not found for this post.'}), 404
    comment = Comment(content=content, user_id=user_id, post_id=post_id, parent_id=parent_id)
    db.session.add(comment)
    db.session.commit()
    return jsonify({'message': 'Comment added.', 'comment': comment.to_dict()}), 201


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
