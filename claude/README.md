# Flask Blog

## 실행 방법

### 1. MySQL 설치 및 설정

```bash
# MySQL 접속 및 비밀번호 설정
mysql -u root -p
```

MySQL에서 실행:
```sql
-- 데이터베이스 생성
CREATE DATABASE blog_db;
EXIT;
```

### 2. 프로젝트 설정

```bash
# 의존성 설치
cd backend
pip install -r requirements.txt
```

### 3. 환경변수 설정

프로젝트 **루트 폴더**에 `.env` 파일 생성:

```bash
cd ..  # blog-project/ 폴더로 이동
nano .env
```

`.env` 파일 내용:

```bash
# MySQL 데이터베이스 설정
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=12345
DB_NAME=blog_db
```

### 4. 실행

```bash
cd backend
python app.py
```

브라우저에서 `http://localhost:5000` 접속

---

## 주요 기능

- 회원가입/로그인
- 게시글 작성/수정/삭제
- 댓글/대댓글

## 기술 스택

- Python/Flask
- MySQL
- HTML/CSS/JavaScript