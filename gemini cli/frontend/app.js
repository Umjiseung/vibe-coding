
document.addEventListener('DOMContentLoaded', () => {
    // Mock Data
    let posts = [
        { id: 1, title: '첫 번째 게시글', content: '첫 번째 게시글 내용입니다.', author: '김코딩', date: '2024-01-01', comments: [
            { id: 1, author: '박해커', content: '잘 보고 갑니다.', replies: [] }
        ]},
        { id: 2, title: '두 번째 게시글', content: '두 번째 게시글 내용입니다.', author: '이해커', date: '2024-01-02', comments: [] }
    ];
    let users = []; // { username, password }

    // --- Session Management ---
    const getCurrentUser = () => sessionStorage.getItem('currentUser');
    const setCurrentUser = (username) => sessionStorage.setItem('currentUser', username);
    const logout = () => {
        sessionStorage.removeItem('currentUser');
        window.location.hash = '#';
        updateHeader();
        router();
    };

    // --- DOM Elements ---
    const postListContainer = document.getElementById('post-list-container');
    const postDetailContainer = document.getElementById('post-detail-container');
    const postFormContainer = document.getElementById('post-form-container');
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const views = [postListContainer, postDetailContainer, postFormContainer, loginContainer, registerContainer];

    const postList = document.getElementById('post-list');
    const postDetail = document.getElementById('post-detail');
    const commentList = document.getElementById('comment-list');

    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const newPostBtn = document.getElementById('new-post-btn');


    // --- UI Update Functions ---
    const updateHeader = () => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            authButtons.style.display = 'none';
            userInfo.style.display = 'flex';
            usernameDisplay.textContent = currentUser;
        } else {
            authButtons.style.display = 'flex';
            userInfo.style.display = 'none';
        }
    };

    const hideAllViews = () => {
        views.forEach(view => view.classList.remove('active'));
    };


    // --- Router ---
    const router = () => {
        const hash = window.location.hash.substring(1);
        const [path, id] = hash.split('/');
        const currentUser = getCurrentUser();

        hideAllViews();

        if (path === 'post' && id) {
            postDetailContainer.classList.add('active');
            renderPostDetail(parseInt(id, 10));
        } else if (path === 'new-post' && currentUser) {
            postFormContainer.classList.add('active');
            renderPostForm();
        } else if (path === 'edit-post' && id && currentUser) {
            postFormContainer.classList.add('active');
            renderPostForm(parseInt(id, 10));
        } else if (path === 'login') {
            loginContainer.classList.add('active');
        } else if (path === 'register') {
            registerContainer.classList.add('active');
        } else {
            window.location.hash = '';
            postListContainer.classList.add('active');
            renderPostList();
        }
    };


    // --- Render Functions ---
    const renderPostList = () => {
        const loader = document.getElementById('post-list-loader');
        postList.innerHTML = '';
        loader.style.display = 'block';

        // Simulate network delay
        setTimeout(() => {
            posts.forEach(post => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>by ${post.author} on ${post.date}</p>
                `;
                li.addEventListener('click', () => {
                    window.location.hash = `#post/${post.id}`;
                });
                postList.appendChild(li);
            });
            loader.style.display = 'none';
        }, 500);
    };

    const renderPostDetail = (id) => {
        const loader = document.getElementById('post-detail-loader');
        postDetail.innerHTML = '';
        commentList.innerHTML = '';
        loader.style.display = 'block';

        // Simulate network delay
        setTimeout(() => {
            const post = posts.find(p => p.id === id);
            if (!post) {
                window.location.hash = '#';
                return;
            }

            const currentUser = getCurrentUser();
            const authorControls = currentUser === post.author ? `
            <div class="post-controls">
                <button id="edit-post-btn" class="fancy-button">수정</button>
                <button id="delete-post-btn" class="fancy-button">삭제</button>
            </div>
        ` : '';

            postDetail.innerHTML = `
            <h2>${post.title}</h2>
            <div class="post-meta">
                <span>by ${post.author}</span> | <span>${post.date}</span>
            </div>
            <div class="post-content">${post.content.replace(/\n/g, '<br>')}</div>
            ${authorControls}
        `;

            if (currentUser === post.author) {
                document.getElementById('edit-post-btn').addEventListener('click', () => {
                    window.location.hash = `#edit-post/${post.id}`;
                });
                document.getElementById('delete-post-btn').addEventListener('click', () => {
                    if (confirm('정말로 삭제하시겠습니까?')) {
                        deletePost(post.id);
                    }
                });
            }

            renderCommentList(post);
            document.getElementById('comment-form').style.display = currentUser ? 'flex' : 'none';
            loader.style.display = 'none';
        }, 500);
    };

    const renderCommentList = (post) => {
        commentList.innerHTML = '';
        post.comments.forEach(comment => {
            const li = document.createElement('li');
            li.dataset.commentId = comment.id;
            li.innerHTML = `
                <div class="comment-author">${comment.author}</div>
                <div class="comment-content">${comment.content}</div>
                <div class="reply-list"></div>
                <button class="reply-btn fancy-button">답글 달기</button>
                <div class="reply-form-container" style="display: none;">
                    <form class="reply-form">
                        <textarea class="reply-content" placeholder="답글 내용" required></textarea>
                        <button type="submit" class="fancy-button">답글 작성</button>
                    </form>
                </div>
            `;
            commentList.appendChild(li);
            renderReplyList(li.querySelector('.reply-list'), comment.replies);
        });
    };

    const renderReplyList = (container, replies) => {
        container.innerHTML = '';
        replies.forEach(reply => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="comment-author">${reply.author}</div>
                <div class="comment-content">${reply.content}</div>
            `;
            container.appendChild(li);
        });
    };

    const renderPostForm = (id) => {
        const formTitle = document.getElementById('form-title');
        const postIdInput = document.getElementById('post-id');
        const postTitleInput = document.getElementById('post-title');
        const postContentInput = document.getElementById('post-content');

        if (id) {
            const post = posts.find(p => p.id === id);
            if (post && post.author === getCurrentUser()) {
                formTitle.textContent = '글 수정';
                postIdInput.value = post.id;
                postTitleInput.value = post.title;
                postContentInput.value = post.content;
            } else {
                alert('수정 권한이 없습니다.');
                window.location.hash = `#post/${id}`;
            }
        } else {
            formTitle.textContent = '새 글 작성';
            postIdInput.value = '';
            postTitleInput.value = '';
            postContentInput.value = '';
        }
    };

    // --- Data & Auth Functions ---
    const deletePost = (id) => {
        posts = posts.filter(p => p.id !== id);
        window.location.hash = '#';
    };

    const addComment = (postId, content) => {
        const post = posts.find(p => p.id === postId);
        const author = getCurrentUser();
        if (post && author) {
            const newComment = {
                id: post.comments.length > 0 ? Math.max(...post.comments.map(c => c.id)) + 1 : 1,
                author,
                content,
                replies: []
            };
            post.comments.push(newComment);
            router();
        }
    };

    const addReply = (postId, commentId, content) => {
        const post = posts.find(p => p.id === postId);
        const author = getCurrentUser();
        if (post && author) {
            const comment = post.comments.find(c => c.id === commentId);
            if (comment) {
                const newReply = {
                    id: comment.replies.length > 0 ? Math.max(...comment.replies.map(r => r.id)) + 1 : 1,
                    author,
                    content
                };
                comment.replies.push(newReply);
                router();
            }
        }
    };

    const handleRegister = (username, password) => {
        if (users.find(u => u.username === username)) {
            alert('이미 존재하는 사용자 이름입니다.');
            return;
        }
        users.push({ username, password });
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        window.location.hash = '#login';
    };

    const handleLogin = (username, password) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(username);
            updateHeader();
            window.location.hash = '#';
        } else {
            alert('사용자 이름 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    // --- Event Listeners ---
    window.addEventListener('hashchange', router);

    loginBtn.addEventListener('click', () => window.location.hash = '#login');
    registerBtn.addEventListener('click', () => window.location.hash = '#register');
    logoutBtn.addEventListener('click', logout);
    newPostBtn.addEventListener('click', () => window.location.hash = '#new-post');

    document.getElementById('cancel-btn').addEventListener('click', () => {
        window.history.back();
    });

    document.getElementById('post-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('post-id').value, 10);
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const author = getCurrentUser();

        if (!author) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (id) {
            const post = posts.find(p => p.id === id);
            if (post && post.author === author) {
                post.title = title;
                post.content = content;
            }
        } else {
            const newPost = {
                id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
                title,
                content,
                author,
                date: new Date().toISOString().split('T')[0],
                comments: []
            };
            posts.push(newPost);
        }
        window.location.hash = `#post/${id || posts[posts.length - 1].id}`;
    });

    document.getElementById('comment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const postId = parseInt(window.location.hash.split('/')[1], 10);
        const content = document.getElementById('comment-content').value;
        addComment(postId, content);
        e.target.reset();
    });

    commentList.addEventListener('click', (e) => {
        if (e.target.classList.contains('reply-btn')) {
            const replyFormContainer = e.target.nextElementSibling;
            const isVisible = replyFormContainer.style.display === 'block';
            replyFormContainer.style.display = isVisible ? 'none' : 'block';
        }
    });

    commentList.addEventListener('submit', (e) => {
        if (e.target.classList.contains('reply-form')) {
            e.preventDefault();
            const postId = parseInt(window.location.hash.split('/')[1], 10);
            const commentId = parseInt(e.target.closest('li').dataset.commentId, 10);
            const content = e.target.querySelector('.reply-content').value;
            addReply(postId, commentId, content);
        }
    });

    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        handleRegister(username, password);
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        handleLogin(username, password);
    });

    // --- Initial Load ---
    updateHeader();
    router();
});
