# 미니 게시판 데모

간단한 Flask 백엔드와 정적 HTML/JS 프론트엔드로 구성된 게시판 예제입니다. 회원가입/로그인, 글 CRUD, 댓글 및 대댓글을 제공합니다. 로컬 개발 시 백엔드와 프런트엔드를 각각 실행한 뒤 브라우저에서 확인하면 됩니다.

## 실행 빠른 가이드

1. **백엔드**
   ```bash
   pip install -r backend/requirements.txt
   python backend/app.py  # 또는 flask --app backend.app run
   ```
   환경변수(`DATABASE_URL`, `SECRET_KEY`, `FLASK_RUN_PORT` 등)는 필요 시 `.env`에 넣어두고 `python-dotenv`와 함께 사용할 수 있습니다.
2. **프런트엔드**
   ```bash
   python -m http.server 3000 --directory frontend
   ```
   이후 브라우저에서 `http://127.0.0.1:3000/` 접속. 다른 포트에서 띄우면 `frontend/js/config.js`가 자동으로 `http://<host>:5000/api`를 바라봅니다. 백엔드와 다른 도메인을 사용할 때는 HTML에서 `window.__API_BASE__ = 'https://example.com/api'`를 `js/config.js`보다 먼저 선언하거나 `<meta name="api-base" ...>`를 추가해 주세요.

## Backend (Flask)

1. 가상환경 생성(선택):
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. 의존성 설치:
   ```bash
   pip install -r requirements.txt
   ```
3. 서버 실행:
   ```bash
   flask --app backend.app run  # 또는 python backend/app.py
   ```
   (기본 포트 `5000`) 처음 실행 시 `backend/instance/blog.db`가 자동 생성됩니다. `python backend/app.py`는 `HOST`, `PORT`, `FLASK_DEBUG` 환경변수를 자동으로 읽어 실행합니다.

### 환경 변수

| 이름 | 용도 | 기본값 |
| --- | --- | --- |
| `DATABASE_URL` | SQLAlchemy 연결 문자열 | `sqlite:///blog.db` |
| `SECRET_KEY` | Flask 세션/보안 키 | `dev-secret-key` |
| `CORS_ORIGINS` | 허용할 CORS 오리진 콤마 리스트 | 모든 오리진 허용 |
| `FLASK_RUN_HOST`/`HOST` | 개발 서버 호스트 | `127.0.0.1` |
| `FLASK_RUN_PORT`/`PORT` | 개발 서버 포트 | `5000` |
| `FLASK_DEBUG`/`DEBUG` | 디버그 모드 on/off | `False` |

## Frontend

프런트 페이지 구성은 다음과 같습니다.

- `frontend/index.html` – 랜딩 페이지/플로우 안내
- `frontend/login.html`, `frontend/register.html` – 인증
- `frontend/posts.html` – 전체 글 목록
- `frontend/post.html?id=<글ID>` – 글 상세 및 댓글
- `frontend/editor.html[?id=<글ID>]` – 글 작성/수정

파일을 직접 더블클릭하거나 아래처럼 간단한 정적 서버를 띄울 수도 있습니다.

```bash
cd frontend
python3 -m http.server 8080
```

`frontend/js/config.js`가 프런트의 오리진을 기준으로 API 주소를 추론하며, 수동으로 바꾸고 싶다면 페이지 상단에 다음 스니펫을 넣습니다.

```html
<script>
  window.__API_BASE__ = 'http://127.0.0.1:5000/api';
</script>
<script src="./js/config.js"></script>
```

혹은 `<meta name="api-base" content="https://api.example.com">`를 추가해도 됩니다. 항상 Flask 서버를 먼저 실행한 뒤 프런트 페이지를 열어주세요.

## 주요 API 요약

- `POST /api/register` – username/password로 회원가입
- `POST /api/login` – 로그인 후 사용자 정보 반환 (세션/토큰 없이 단순 예제)
- `GET /api/posts` – 게시글 목록
- `POST /api/posts` – 글 작성 (title, content, user_id 필요)
- `GET/PUT/DELETE /api/posts/<id>` – 글 상세/수정/삭제
- `GET /api/posts/<id>/comments` – 댓글 트리
- `POST /api/posts/<id>/comments` – 댓글/대댓글 작성 (content, user_id, parent_id 선택)

간단한 데모용이라 로그인 세션이나 권한 검증을 최소화했습니다. 실서비스에선 토큰 기반 인증과 추가 검증을 추가하세요.
