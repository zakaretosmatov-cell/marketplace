'use client';

import { useAuth, Role } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Rediect to login if not logged in
        router.push('/login');
      } else if (allowedRoles && (!role || !allowedRoles.includes(role))) {
        // Redirect to home if user exists but lacks role
        router.push('/');
      }
    }
  }, [user, role, isLoading, router, allowedRoles]);

  // Show a full-screen loader while checking auth state
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid var(--border-color)', 
          borderTopColor: 'var(--accent-color)', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite' 
        }} />
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Prevent flash of unauthorized content if auth check failed 
  // (the layout will unmount because router.push is executed, but we return null to be safe)
  if (!user || (allowedRoles && (!role || !allowedRoles.includes(role)))) {
    return null;
  }

  return <>{children}</>;
}
