import mysql.connector
from mysql.connector import Error
from datetime import datetime
from contextlib import contextmanager

# MySQL 연결 설정
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',  # MySQL 사용자명
    'password': '12345',  # MySQL 비밀번호로 변경!
    'database': 'blog_db'
}

@contextmanager
def get_db_connection():
    """데이터베이스 연결 컨텍스트 매니저"""
    connection = None
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        yield connection
    except Error as e:
        print(f"Database error: {e}")
        raise
    finally:
        if connection and connection.is_connected():
            connection.close()

def init_database():
    """데이터베이스 및 테이블 초기화"""
    try:
        # 데이터베이스 생성
        connection = mysql.connector.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )
        cursor = connection.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']}")
        cursor.close()
        connection.close()
        
        # 테이블 생성
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # users 테이블
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # posts 테이블
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS posts (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(200) NOT NULL,
                    content TEXT NOT NULL,
                    author VARCHAR(50) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (author) REFERENCES users(username) ON DELETE CASCADE
                )
            """)
            
            # comments 테이블 (댓글)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS comments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    post_id INT NOT NULL,
                    author VARCHAR(50) NOT NULL,
                    content TEXT NOT NULL,
                    parent_id INT DEFAULT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
                    FOREIGN KEY (author) REFERENCES users(username) ON DELETE CASCADE,
                    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
                )
            """)
            
            conn.commit()
            cursor.close()
            print("✅ Database initialized successfully!")
            
    except Error as e:
        print(f"❌ Error initializing database: {e}")
        raise

class User:
    @staticmethod
    def create(username, password_hash):
        """새 사용자 생성"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO users (username, password) VALUES (%s, %s)",
                    (username, password_hash)
                )
                conn.commit()
                cursor.close()
                return True
        except Error as e:
            print(f"Error creating user: {e}")
            return False
    
    @staticmethod
    def get(username):
        """사용자 정보 조회"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                cursor.execute(
                    "SELECT * FROM users WHERE username = %s",
                    (username,)
                )
                user = cursor.fetchone()
                cursor.close()
                return user
        except Error as e:
            print(f"Error getting user: {e}")
            return None
    
    @staticmethod
    def exists(username):
        """사용자 존재 여부 확인"""
        return User.get(username) is not None

class Post:
    @staticmethod
    def create(title, content, author):
        """새 게시글 작성"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO posts (title, content, author) VALUES (%s, %s, %s)",
                    (title, content, author)
                )
                conn.commit()
                post_id = cursor.lastrowid
                cursor.close()
                return Post.get(post_id)
        except Error as e:
            print(f"Error creating post: {e}")
            return None
    
    @staticmethod
    def get(post_id):
        """게시글 조회"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                cursor.execute(
                    "SELECT * FROM posts WHERE id = %s",
                    (post_id,)
                )
                post = cursor.fetchone()
                cursor.close()
                if post:
                    post['created_at'] = post['created_at'].strftime('%Y-%m-%d %H:%M:%S')
                return post
        except Error as e:
            print(f"Error getting post: {e}")
            return None
    
    @staticmethod
    def get_all():
        """모든 게시글 조회 (최신순)"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                cursor.execute(
                    "SELECT * FROM posts ORDER BY created_at DESC"
                )
                posts = cursor.fetchall()
                cursor.close()
                for post in posts:
                    post['created_at'] = post['created_at'].strftime('%Y-%m-%d %H:%M:%S')
                return posts
        except Error as e:
            print(f"Error getting all posts: {e}")
            return []
    
    @staticmethod
    def update(post_id, title, content):
        """게시글 수정"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE posts SET title = %s, content = %s WHERE id = %s",
                    (title, content, post_id)
                )
                conn.commit()
                cursor.close()
                return True
        except Error as e:
            print(f"Error updating post: {e}")
            return False
    
    @staticmethod
    def delete(post_id):
        """게시글 삭제"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM posts WHERE id = %s", (post_id,))
                conn.commit()
                cursor.close()
                return True
        except Error as e:
            print(f"Error deleting post: {e}")
            return False
    
    @staticmethod
    def is_author(post_id, username):
        """작성자 확인"""
        post = Post.get(post_id)
        return post and post['author'] == username

class Comment:
    @staticmethod
    def create(post_id, author, content, parent_id=None):
        """새 댓글/대댓글 작성"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO comments (post_id, author, content, parent_id) VALUES (%s, %s, %s, %s)",
                    (post_id, author, content, parent_id)
                )
                conn.commit()
                comment_id = cursor.lastrowid
                cursor.close()
                return Comment.get(comment_id)
        except Error as e:
            print(f"Error creating comment: {e}")
            return None
    
    @staticmethod
    def get(comment_id):
        """댓글 조회"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                cursor.execute(
                    "SELECT * FROM comments WHERE id = %s",
                    (comment_id,)
                )
                comment = cursor.fetchone()
                cursor.close()
                if comment:
                    comment['created_at'] = comment['created_at'].strftime('%Y-%m-%d %H:%M:%S')
                return comment
        except Error as e:
            print(f"Error getting comment: {e}")
            return None
    
    @staticmethod
    def get_by_post(post_id):
        """게시글의 모든 댓글 조회 (계층 구조)"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor(dictionary=True)
                # 모든 댓글 가져오기
                cursor.execute(
                    "SELECT * FROM comments WHERE post_id = %s ORDER BY created_at ASC",
                    (post_id,)
                )
                all_comments = cursor.fetchall()
                cursor.close()
                
                # 시간 포맷 변환
                for comment in all_comments:
                    comment['created_at'] = comment['created_at'].strftime('%Y-%m-%d %H:%M:%S')
                    comment['replies'] = []
                
                # 댓글-대댓글 구조화
                comment_dict = {c['id']: c for c in all_comments}
                root_comments = []
                
                for comment in all_comments:
                    if comment['parent_id'] is None:
                        root_comments.append(comment)
                    else:
                        parent = comment_dict.get(comment['parent_id'])
                        if parent:
                            parent['replies'].append(comment)
                
                return root_comments
        except Error as e:
            print(f"Error getting comments: {e}")
            return []
    
    @staticmethod
    def delete(comment_id):
        """댓글 삭제"""
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM comments WHERE id = %s", (comment_id,))
                conn.commit()
                cursor.close()
                return True
        except Error as e:
            print(f"Error deleting comment: {e}")
            return False
    
    @staticmethod
    def is_author(comment_id, username):
        """댓글 작성자 확인"""
        comment = Comment.get(comment_id)
        return comment and comment['author'] == username

def get_all_posts():
    """모든 게시글 조회 (하위 호환성)"""
    return Post.get_all()