from flask import Flask, render_template, session
from routes.auth import auth_bp
from routes.posts import posts_bp
import secrets

app = Flask(__name__, 
            template_folder='../frontend/templates',
            static_folder='../frontend/static')
app.secret_key = secrets.token_hex(16)

# 블루프린트 등록
app.register_blueprint(auth_bp)
app.register_blueprint(posts_bp)

@app.route('/')
def home():
    from models import get_all_posts
    posts = get_all_posts()
    return render_template('home.html', posts=posts)

if __name__ == '__main__':
    app.run(debug=True, port=5000)