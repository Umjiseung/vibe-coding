import os
from datetime import timedelta

class Config:
    # MySQL 데이터베이스 설정
    # 형식: mysql+pymysql://username:password@host:port/database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 
        'mysql+pymysql://root:12345@localhost:3306/blog_db?charset=utf8mb4'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_size': 10,
        'max_overflow': 20
    }
    
    # JWT 설정
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    
    # CORS 설정
    CORS_ORIGINS = ['http://localhost:3000', 'https://claude.ai']
    
    # 이메일 설정 (비밀번호 찾기용)
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:12345@localhost:3306/blog_db?charset=utf8mb4'

class ProductionConfig(Config):
    DEBUG = False
    # 프로덕션 환경에서는 환경변수 사용
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:12345@localhost:3306/blog_test_db?charset=utf8mb4'