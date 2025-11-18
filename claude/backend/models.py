from datetime import datetime

# 메모리 데이터베이스
users = {}
posts = {}
post_id_counter = 1

class User:
    @staticmethod
    def create(username, password_hash):
        users[username] = {
            'password': password_hash
        }
    
    @staticmethod
    def get(username):
        return users.get(username)
    
    @staticmethod
    def exists(username):
        return username in users

class Post:
    @staticmethod
    def create(title, content, author):
        global post_id_counter
        post = {
            'id': post_id_counter,
            'title': title,
            'content': content,
            'author': author,
            'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        posts[post_id_counter] = post
        post_id_counter += 1
        return post
    
    @staticmethod
    def get(post_id):
        return posts.get(post_id)
    
    @staticmethod
    def update(post_id, title, content):
        if post_id in posts:
            posts[post_id]['title'] = title
            posts[post_id]['content'] = content
            return True
        return False
    
    @staticmethod
    def delete(post_id):
        if post_id in posts:
            del posts[post_id]
            return True
        return False
    
    @staticmethod
    def is_author(post_id, username):
        post = posts.get(post_id)
        return post and post['author'] == username

def get_all_posts():
    return sorted(posts.values(), key=lambda x: x['created_at'], reverse=True)
