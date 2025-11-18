from flask import request, jsonify
from app import create_app, db
from app.models import Post, Comment

app = create_app()

# Helper function to format comments
def format_comments(comments):
    comment_map = {comment.id: comment.to_dict() for comment in comments}
    for comment_dict in comment_map.values():
        comment_dict['replies'] = []

    result = []
    for comment in comments:
        if comment.parent_id:
            if comment.parent_id in comment_map:
                parent_comment = comment_map[comment.parent_id]
                parent_comment['replies'].append(comment_map[comment.id])
        else:
            result.append(comment_map[comment.id])
    return result

@app.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([post.to_dict() for post in posts])

@app.route('/posts/<int:id>', methods=['GET'])
def get_post(id):
    post = Post.query.get_or_404(id)
    post_data = post.to_dict()
    comments = Comment.query.filter_by(post_id=id).order_by(Comment.created_at.asc()).all()
    post_data['comments'] = format_comments(comments)
    return jsonify(post_data)

@app.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    new_post = Post(title=data['title'], content=data['content'])
    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.to_dict()), 201

@app.route('/posts/<int:id>', methods=['PUT'])
def update_post(id):
    post = Post.query.get_or_404(id)
    data = request.get_json()
    post.title = data['title']
    post.content = data['content']
    db.session.commit()
    return jsonify(post.to_dict())

@app.route('/posts/<int:id>', methods=['DELETE'])
def delete_post(id):
    post = Post.query.get_or_404(id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post deleted'})

@app.route('/posts/<int:post_id>/comments', methods=['POST'])
def create_comment(post_id):
    data = request.get_json()
    post = Post.query.get_or_404(post_id)
    
    parent_id = data.get('parent_id')
    if parent_id:
        parent_comment = Comment.query.get_or_404(parent_id)
        if parent_comment.post_id != post_id:
             return jsonify({'error': 'Parent comment does not belong to this post'}), 400

    new_comment = Comment(
        content=data['content'],
        post_id=post.id,
        parent_id=parent_id
    )
    db.session.add(new_comment)
    db.session.commit()
    
    # Return all comments for the post to refresh the list
    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at.asc()).all()
    return jsonify(format_comments(comments)), 201
