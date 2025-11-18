# 미니 게시판 데모

간단한 Flask 백엔드와 정적 HTML/JS 프론트엔드로 구성된 게시판 예제입니다. 회원가입/로그인, 글 CRUD, 댓글 및 대댓글을 제공합니다.

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
   flask --app app run
   ```
   (기본 포트 `5000`) 처음 실행 시 `backend/blog.db`가 자동 생성됩니다.

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

프론트 스크립트는 기본적으로 `http://127.0.0.1:5000/api`를 바라보므로, Flask 서버를 먼저 실행한 뒤 원하는 페이지를 브라우저에서 열어주세요.

## 주요 API 요약

- `POST /api/register` – username/password로 회원가입
- `POST /api/login` – 로그인 후 사용자 정보 반환 (세션/토큰 없이 단순 예제)
- `GET /api/posts` – 게시글 목록
- `POST /api/posts` – 글 작성 (title, content, user_id 필요)
- `GET/PUT/DELETE /api/posts/<id>` – 글 상세/수정/삭제
- `GET /api/posts/<id>/comments` – 댓글 트리
- `POST /api/posts/<id>/comments` – 댓글/대댓글 작성 (content, user_id, parent_id 선택)

간단한 데모용이라 로그인 세션이나 권한 검증을 최소화했습니다. 실서비스에선 토큰 기반 인증과 추가 검증을 추가하세요.
