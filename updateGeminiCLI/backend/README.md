# 백엔드 (Flask)

이 디렉토리는 Flask 기반의 백엔드 API 서버를 포함합니다.

## 기술 스택

-   **프레임워크**: Flask
-   **데이터베이스**: MySQL (Flask-SQLAlchemy를 통해 연동)
-   **마이그레이션 도구**: Flask-Migrate
-   **인증**: JWT (Flask-JWT-Extended)
-   **이메일**: Flask-Mail
-   **CORS**: Flask-CORS
-   **비밀번호 해싱**: Werkzeug Security

## 기능

-   사용자 인증 (회원가입, 로그인, 비밀번호 찾기)
-   게시판 CRUD (생성, 조회, 수정, 삭제)
-   게시글에 대한 댓글 기능
-   게시글 및 댓글에 대한 좋아요 기능
-   월간 인기 게시글 랭킹 조회
-   사용자 프로필 및 작성 게시글 조회

## 설정 및 실행 방법

### 1. 가상 환경 생성 및 의존성 설치

```bash
# backend 디렉토리로 이동
cd backend

# 가상 환경 생성
python -m venv venv

# 가상 환경 활성화 (macOS/Linux)
source venv/bin/activate

# 가상 환경 활성화 (Windows)
# venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

### 2. 데이터베이스 설정 (`config.py`)

`backend/config.py` 파일을 열어 다음 설정들을 실제 환경에 맞게 수정해야 합니다.

-   **`SQLALCHEMY_DATABASE_URI`**: MySQL 데이터베이스 연결 정보 (예: `mysql+pymysql://user:password@host/db_name`)
-   **`SECRET_KEY`**: Flask 세션 및 기타 보안 기능에 사용되는 비밀 키
-   **`JWT_SECRET_KEY`**: JWT 토큰 서명에 사용되는 비밀 키
-   **`MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USE_TLS`**: 비밀번호 찾기 기능에 사용되는 이메일 서버 정보 (예: Gmail SMTP 설정)

### 3. 데이터베이스 초기화 및 마이그레이션

데이터베이스 스키마를 생성하고 적용합니다. **데이터베이스는 미리 생성되어 있어야 합니다.** (예: MySQL 클라이언트에서 `CREATE DATABASE your_db_name;` 실행)

```bash
# `backend` 디렉토리 내에서 실행
export PYTHONPATH=$PYTHONPATH:$(pwd) # 현재 디렉토리를 Python 경로에 추가
export FLASK_APP=main.py            # Flask 애플리케이션 진입점 설정

# 마이그레이션 저장소 초기화 (처음 한 번만)
venv/bin/flask db init

# 마이그레이션 스크립트 생성
venv/bin/flask db migrate -m "Initial migration"

# 데이터베이스에 마이그레이션 적용
venv/bin/flask db upgrade
```

### 4. Flask 개발 서버 실행

```bash
# `backend` 디렉토리 내에서 실행
export PYTHONPATH=$PYTHONPATH:$(pwd)
export FLASK_APP=main.py

# 개발 서버 실행
venv/bin/flask run
```
서버는 기본적으로 `http://127.0.0.1:5000`에서 실행됩니다.

## API 엔드포인트 예시

-   **`/auth/register`**: 사용자 회원가입 (POST)
-   **`/auth/login`**: 사용자 로그인 (POST)
-   **`/boards/`**: 모든 게시글 조회 (GET), 새 게시글 생성 (POST, JWT 필요)
-   **`/boards/<int:board_id>`**: 특정 게시글 조회 (GET), 수정 (PUT, JWT 필요), 삭제 (DELETE, JWT 필요)
-   **`/comments/<int:board_id>`**: 특정 게시글에 댓글 작성 (POST, JWT 필요)
-   **`/user/me`**: 현재 로그인된 사용자 정보 조회 (GET, JWT 필요)
-   **`/like/board/<int:board_id>`**: 게시글 좋아요/좋아요 취소 (POST, JWT 필요)
-   **`/like/ranking`**: 월간 인기 게시글 랭킹 조회 (GET)
-   **`/auth/forgot-password`**: 비밀번호 재설정 이메일 요청 (POST)
-   **`/auth/reset-password`**: 비밀번호 재설정 (POST)

---

이 README 파일은 백엔드 개발 및 사용에 대한 기본적인 가이드라인을 제공합니다.
