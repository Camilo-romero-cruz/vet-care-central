
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  // If no user, redirect to login
  return <Navigate to="/login" replace />;
};

export default Index;
