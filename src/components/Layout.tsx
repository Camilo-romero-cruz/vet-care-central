
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProtectedLayoutProps {
  allowedRoles: UserRole[];
}

export const Layout: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in ${isMobile ? 'pb-16' : ''}`}>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ allowedRoles }) => {
  const { currentUser, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser || !hasPermission(allowedRoles)) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
};
