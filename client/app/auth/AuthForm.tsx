// /components/auth/AuthForm.tsx
"use client";
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function AuthForm({ type }: { type: 'login' | 'register' }) {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (type === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
      <form className="card-body" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-center">
          {type === 'login' ? 'Welcome Back!' : 'Create an Account'}
        </h1>
        {type === 'register' && (
          <div className="form-control">
            <label className="label"><span className="label-text">Name</span></label>
            <input type="text" name="name" placeholder="Your Name" className="input input-bordered" required onChange={handleChange} />
          </div>
        )}
        <div className="form-control">
          <label className="label"><span className="label-text">Email</span></label>
          <input type="email" name="email" placeholder="email@example.com" className="input input-bordered" required onChange={handleChange} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Password</span></label>
          <input type="password" name="password" placeholder="password" className="input input-bordered" required onChange={handleChange} />
        </div>
        {error && <p className="text-error text-sm mt-2">{error}</p>}
        <div className="form-control mt-6">
          <button className="btn btn-primary" type="submit">
            {type === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </div>
        <p className="mt-4 text-center text-sm">
          {type === 'login' ? "Don't have an account? " : "Already have an account? "}
          <Link href={type === 'login' ? '/auth/register' : '/auth/login'} className="link-primary link">
            {type === 'login' ? 'Sign Up' : 'Log In'}
          </Link>
        </p>
      </form>
    </div>
  );
}