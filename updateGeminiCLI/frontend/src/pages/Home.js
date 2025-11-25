import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-4">
      <div className="card text-center">
        <div className="card-body">
          <h2 className="card-title">저희 블로그에 오신 것을 환영합니다!</h2>
          <p className="card-text">
            이곳은 여러분의 생각과 아이디어를 세상과 공유할 수 있는 공간입니다.
          </p>
          <Link to="/boards" className="btn btn-primary">게시판으로 이동</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
