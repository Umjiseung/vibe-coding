# 블로그 애플리케이션 (Flask + Vanilla JS)

이 프로젝트는 Flask를 백엔드로, 순수 JavaScript(Vanilla JS)를 프론트엔드로 사용하는 블로그 애플리케이션입니다.

## 프로젝트 구조
```
.
├── backend/      # Flask 백엔드 서버
│   ├── app/
│   ├── migrations/
│   ├── run.py
│   └── requirements.txt
└── frontend/     # Vanilla JS 프론트엔드
    ├── app.js
    ├── index.html
    └── style.css
```

## 전체 프로젝트 실행 방법

### 1. 백엔드 서버 실행

백엔드 서버를 먼저 실행해야 프론트엔드와 정상적으로 통신할 수 있습니다.

1.  **터미널을 열고 백엔드 디렉토리로 이동합니다.**
    ```bash
    cd "/Users/eomjiseong/Desktop/vibe coding/gemini cli/backend"
    ```

2.  **Python 가상 환경을 생성합니다.** (권장)
    ```bash
    python3 -m venv venv
    ```

3.  **가상 환경을 활성화합니다.**
    *   macOS/Linux:
        ```bash
        source venv/bin/activate
        ```
    *   Windows:
        ```bash
        venv\Scripts\activate
        ```

4.  **필요한 패키지를 설치합니다.**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Flask 서버를 실행합니다.**
    ```bash
    python run.py
    ```

    서버가 `http://127.0.0.1:5000`에서 실행됩니다. 터미널을 이 상태로 유지해주세요.

### 2. 프론트엔드 애플리케이션 실행

새로운 터미널을 열거나, 기존 터미널과 별개로 파일 탐색기를 사용합니다.

```bash
cd frontend
python -m http.server
```

```bash
http://localhost:8000
```

1.  **`frontend` 디렉토리의 `index.html` 파일을 웹 브라우저에서 엽니다.**
    가장 간단한 방법은 파일 탐색기에서 `/Users/eomjiseong/Desktop/vibe coding/gemini cli/frontend/index.html` 파일을 찾아 웹 브라우저(Chrome, Safari 등)로 드래그하는 것입니다.

2.  **애플리케이션 사용**
    이제 브라우저에 표시된 블로그를 사용할 수 있습니다. 회원가입, 로그인 후 게시글을 작성하고 댓글을 남겨보세요. 프론트엔드 애플리케이션은 백엔드 서버와 통신하여 데이터를 주고받습니다.

## 참고
*   백엔드 서버가 실행 중인 터미널을 닫으면 프론트엔드에서 데이터를 불러오거나 저장할 수 없습니다.
*   프로젝트 사용이 끝나면 백엔드 터미널에서 `Ctrl + C`를 눌러 서버를 중지하고, `deactivate` 명령어를 실행하여 가상 환경을 비활성화할 수 있습니다.
