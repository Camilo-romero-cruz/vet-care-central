
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Package, 
  Users, 
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PawIcon } from './icons/PawIcon';

// Versión con React, que mantendremos funcionando con la estructura actual
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

/*
 * A continuación se muestra cómo podría implementarse de forma equivalente
 * usando HTML, CSS y JavaScript puros (solo como referencia)
 *
 * HTML que se usaría (esto iría en index.html):
 *
 * <nav id="mobile-navbar" class="mobile-nav">
 *   <a href="/" class="mobile-nav-item" data-path="/">
 *     <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 *       <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
 *       <polyline points="9 22 9 12 15 12 15 22"></polyline>
 *     </svg>
 *     <span class="mobile-nav-label">Inicio</span>
 *   </a>
 *   <!-- Más enlaces aquí... -->
 * </nav>
 *
 * CSS que se usaría:
 *
 * .mobile-nav {
 *   position: fixed;
 *   bottom: 0;
 *   left: 0;
 *   right: 0;
 *   border-top: 1px solid #e2e8f0;
 *   background-color: white;
 *   z-index: 50;
 *   display: flex;
 *   justify-content: space-around;
 *   align-items: center;
 *   height: 4rem;
 * }
 * 
 * @media (min-width: 768px) {
 *   .mobile-nav {
 *     display: none;
 *   }
 * }
 * 
 * .mobile-nav-item {
 *   display: flex;
 *   flex-direction: column;
 *   align-items: center;
 *   justify-content: center;
 *   padding: 0.5rem;
 *   font-size: 0.75rem;
 *   color: #64748b;
 *   text-decoration: none;
 * }
 * 
 * .mobile-nav-item.active {
 *   color: #4f46e5;
 * }
 * 
 * .mobile-nav-icon {
 *   height: 1.25rem;
 *   width: 1.25rem;
 * }
 * 
 * .mobile-nav-item.active .mobile-nav-icon {
 *   fill: #4f46e5;
 * }
 * 
 * .mobile-nav-label {
 *   margin-top: 0.25rem;
 * }
 *
 * JavaScript que se usaría:
 *
 * document.addEventListener('DOMContentLoaded', function() {
 *   // Obtener la ruta actual
 *   const currentPath = window.location.pathname;
 *   
 *   // Encontrar todos los elementos de navegación
 *   const navItems = document.querySelectorAll('#mobile-navbar a');
 *   
 *   // Marcar el elemento activo
 *   navItems.forEach(item => {
 *     if (item.getAttribute('data-path') === currentPath) {
 *       item.classList.add('active');
 *     }
 *     
 *     // Agregar el manejador de clics
 *     item.addEventListener('click', function(event) {
 *       // Si implementamos una SPA, evitaríamos la recarga de la página
 *       // event.preventDefault();
 *       
 *       // Quitar active de todos los elementos
 *       navItems.forEach(nav => nav.classList.remove('active'));
 *       
 *       // Agregar active al elemento clickeado
 *       this.classList.add('active');
 *       
 *       // Cambiar la URL sin recargar (para una SPA)
 *       // history.pushState({}, '', this.getAttribute('data-path'));
 *       
 *       // Actualizar el contenido basado en la ruta
 *       // updateContent(this.getAttribute('data-path'));
 *     });
 *   });
 * });
 */
