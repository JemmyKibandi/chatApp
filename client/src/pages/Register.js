// src/components/Register.jsx
import React from 'react';

function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Register</h2>
        <form>
          <div className="mb-4">
            <label className="block text-white mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full"
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full"
            />
          </div>
          <button className="btn btn-primary w-full">Register</button>
        </form>
        <p className="text-white text-center mt-4">
          Already have an account? <a href="/login" className="text-blue-300">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
