
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Package, 
  Users, 
  FileText,
  Stethoscope,
  PawPrint
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PawIcon } from './icons/PawIcon';

export function MobileNavBar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/appointments', label: 'Citas', icon: Calendar },
    { path: '/products', label: 'Productos', icon: Package },
    { path: '/clients', label: 'Clientes', icon: Users },
    { path: '/pets', label: 'Mascotas', icon: 'Paw' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 text-xs",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.icon === 'Paw' ? (
                <PawIcon className={cn("h-5 w-5", isActive ? "fill-primary" : "fill-muted-foreground")} />
              ) : (
                <item.icon className="h-5 w-5" />
              )}
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
