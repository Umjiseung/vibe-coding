import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/forgot-password', { email });
      setMessage('해당 이메일로 계정이 존재하는 경우, 비밀번호 재설정 링크가 전송되었습니다.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || '오류가 발생했습니다. 백엔드 서버가 실행 중입니까?');
      setMessage('');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">비밀번호 찾기</h2>
              {message && <div className="alert alert-success mt-3">{message}</div>}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              <p className="text-center mt-3">이메일 주소를 입력하시면 비밀번호를 재설정할 수 있는 링크를 보내드립니다.</p>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                  <label className="form-label">이메일 주소</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">재설정 링크 보내기</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
