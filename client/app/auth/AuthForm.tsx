// client/app/auth/AuthForm.tsx
"use client";
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/common/Label';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AuthForm({ type }: { type: 'login' | 'register' }) {
  const { login, register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === 'login') {
        await login(formData.email, formData.password);
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        await register(formData.name, formData.email, formData.password);
        toast.success('Registration successful!');
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{type === 'login' ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
        <CardDescription>
          {type === 'login' ? 'Enter your email below to log into your account.' : 'Enter your details below to create an account.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {type === 'register' && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your Name" required onChange={handleChange} />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="email@example.com" required onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required onChange={handleChange} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-slate-50"></span> : (type === 'login' ? 'Login' : 'Sign Up')}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {type === 'login' ? "Don't have an account? " : "Already have an account? "}
          <Link href={type === 'login' ? '/auth/register' : '/auth/login'} className="underline">
            {type === 'login' ? 'Sign up' : 'Log In'}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}