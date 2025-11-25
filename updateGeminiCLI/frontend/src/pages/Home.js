import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-4">
      <div className="card text-center">
        <div className="card-body">
          <h2 className="card-title">Welcome to Our Blog!</h2>
          <p className="card-text">
            This is a place where you can share your thoughts and ideas with the world.
          </p>
          <Link to="/boards" className="btn btn-primary">Go to Boards</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
