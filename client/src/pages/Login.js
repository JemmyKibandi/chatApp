// src/components/Login.jsx
import React from 'react';

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card lg:card-side bg-white shadow-lg w-full max-w-4xl">
        <figure className="lg:w-1/2">
          <img
            src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
            alt="Album"
            className="object-cover h-full w-full"
          />
        </figure>
        <div className="card-body lg:w-1/2">
          <h2 className="card-title">Welcome Back!</h2>
          <p>Please enter your credentials to login.</p>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input type="email" placeholder="email@example.com" className="input input-bordered w-full" />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
          </div>
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary w-full">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
