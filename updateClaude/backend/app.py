from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config, DevelopmentConfig, ProductionConfig
from models import db
from routes import register_routes
import os

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # 확장 초기화 - CORS 설정
    CORS(app, 
         origins=['http://localhost:3000', 'https://claude.ai'],
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    jwt = JWTManager(app)
    db.init_app(app)
    
    # 라우트 등록
    register_routes(app)
    
    # 데이터베이스 초기화
    with app.app_context():
        try:
            # 테이블 생성 (이미 존재하면 스킵)
            db.create_all()
            print("✅ 데이터베이스 테이블이 생성되었습니다.")
        except Exception as e:
            print(f"❌ 데이터베이스 오류: {e}")
            print("💡 MySQL이 실행 중인지, config.py의 DATABASE_URL이 올바른지 확인하세요.")
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {'status': 'ok', 'message': 'Server is running'}, 200
    
    return app

if __name__ == '__main__':
    # 환경 설정
    env = os.getenv('FLASK_ENV', 'development')
    
    if env == 'production':
        app = create_app(ProductionConfig)
    else:
        app = create_app(DevelopmentConfig)
    
    app.run(debug=True, port=5000, host='0.0.0.0')
