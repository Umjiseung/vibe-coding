# Vibe Coding - Backend (Flask)

간단한 Flask 백엔드 스캐폴딩입니다. MySQL을 사용하며 JWT 인증을 포함합니다.

파일 요약:
- `app.py` : 앱 팩토리
- `config.py` : 환경 설정
- `models.py` : SQLAlchemy 모델
- `routes/` : 블루프린트(인증, 게시글, 댓글, 좋아요, 유저)
- `extensions.py` : 확장 초기화
- `requirements.txt` : 필요한 패키지

환경 변수 예시 (`.env` 파일):
```
SECRET_KEY=change-me
JWT_SECRET_KEY=change-jwt
DATABASE_URL=mysql+pymysql://user:pass@localhost:3306/vibe_db
MAIL_SERVER=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_DEFAULT_SENDER=...
```

설치 및 실행:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app.py
flask run
```

다음 작업으로 마이그레이션 설정 및 테스트 요청을 진행하겠습니다.

마이그레이션 및 DB 초기화
 - Flask-Migrate를 사용한 정식 마이그레이션(권장):
	 ```bash
	 # FLASK_APP 환경 변수에 앱 팩토리를 가리키도록 설정
	 export FLASK_APP="/Users/eomjiseong/Desktop/vibe coding/updateCodex/app.py"
	 # 초기화 (한 번만 실행)
	 flask db init
	 # 변경사항으로부터 마이그레이션 생성
	 flask db migrate -m "init"
	 # DB 적용
	 flask db upgrade
	 ```
 - 빠른 로컬 초기화(마이그레이션 없이 테이블 생성):
	 ```bash
	 # 파이썬 스크립트를 사용해 모델 기반으로 테이블을 즉시 생성
	 python /Users/eomjiseong/Desktop/vibe coding/updateCodex/init_db.py
	 ```

프론트엔드(React/Vite) 개발 서버
 - 프론트엔드 작업은 `frontend/` 폴더에 스캐폴딩되어 있습니다. 다음으로 이동하여 의존성을 설치하세요:
	 ```bash
	 cd frontend
	 npm install
	 npm run dev
	 ```
