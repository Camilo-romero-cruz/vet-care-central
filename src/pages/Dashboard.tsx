
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, Package, DollarSign } from 'lucide-react';
import { PawIcon } from '@/components/icons/PawIcon';
import { appointments, pets, products, users } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const today = new Date();

  // Filter appointments for today
  const todayAppointments = appointments.filter(appointment => {
    return appointment.date === today.toISOString().split('T')[0];
  });

  // Get pending appointments for the current veterinarian
  const pendingAppointments = appointments.filter(appointment => {
    if (currentUser?.role === 'veterinarian') {
      return appointment.veterinarianId === currentUser.id && appointment.status === 'scheduled';
    }
    return appointment.status === 'scheduled';
  });

  // Count clients (users with role 'client')
  const clientCount = users.filter(user => user.role === 'client').length;

  // Count products with low stock (less than 10)
  const lowStockProducts = products.filter(product => product.stock < 10);

  // Cards to display based on user role
  const getCards = () => {
    const baseCards = [
      {
        title: 'Citas Hoy',
        value: todayAppointments.length,
        description: 'Citas programadas para hoy',
        icon: Calendar,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        roles: ['admin', 'veterinarian', 'receptionist'],
      },
      {
        title: 'Citas Pendientes',
        value: pendingAppointments.length,
        description: 'Citas que requieren atención',
        icon: Clock,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        roles: ['admin', 'veterinarian', 'receptionist'],
      },
      {
        title: 'Mascotas Registradas',
        value: pets.length,
        description: 'Total de mascotas en el sistema',
        icon: PawIcon,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        roles: ['admin', 'veterinarian', 'receptionist'],
      },
      {
        title: 'Clientes',
        value: clientCount,
        description: 'Total de clientes registrados',
        icon: Users,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        roles: ['admin', 'receptionist'],
      },
      {
        title: 'Productos con Stock Bajo',
        value: lowStockProducts.length,
        description: 'Productos que necesitan reabastecimiento',
        icon: Package,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        roles: ['admin', 'receptionist'],
      },
      {
        title: 'Ingresos Mensuales',
        value: '$5,240',
        description: 'Ingresos estimados para este mes',
        icon: DollarSign,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-50',
        roles: ['admin'],
      },
    ];

    // Filter cards based on user role
    if (!currentUser) return [];
    return baseCards.filter(card => card.roles.includes(currentUser.role));
  };

  // Cards for client dashboard
  const getClientCards = () => {
    const clientPets = pets.filter(pet => currentUser && pet.ownerId === currentUser.id);
    const clientAppointments = appointments.filter(appointment => {
      return clientPets.some(pet => pet.id === appointment.petId) && appointment.status === 'scheduled';
    });

    return [
      {
        title: 'Tus Mascotas',
        value: clientPets.length,
        description: 'Total de mascotas registradas',
        icon: PawIcon,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
      },
      {
        title: 'Próximas Citas',
        value: clientAppointments.length,
        description: 'Citas programadas',
        icon: Calendar,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
      },
    ];
  };

  // Get appropriate cards based on user role
  const dashboardCards = currentUser?.role === 'client' ? getClientCards() : getCards();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          {today.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`${card.bgColor} ${card.color} p-2 rounded-full`}>
                {card.icon === PawIcon ? (
                  <PawIcon className="h-4 w-4" />
                ) : (
                  <card.icon className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Welcome message based on user role */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Bienvenido, {currentUser?.name}</CardTitle>
          <CardDescription>
            {currentUser?.role === 'admin' && "Tienes acceso completo al sistema de gestión veterinaria."}
            {currentUser?.role === 'veterinarian' && "Puedes ver tus citas programadas y gestionar historiales médicos."}
            {currentUser?.role === 'receptionist' && "Puedes gestionar citas, clientes y productos."}
            {currentUser?.role === 'client' && "Puedes ver tus mascotas y gestionar tus citas."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Este panel te proporciona una visión general de la actividad en la clínica veterinaria. Utiliza el menú lateral para navegar a las diferentes secciones del sistema.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
