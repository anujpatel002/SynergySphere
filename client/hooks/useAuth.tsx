// /hooks/useAuth.ts
"use client";
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Custom hook for accessing the authentication context.
 * This provides a simple way to get the current user, loading state,
 * and authentication functions (login, register, logout) from anywhere
 * in the component tree wrapped by AuthProvider.
 *
 * @returns The authentication context value.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};