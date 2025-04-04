
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, User, Mail, Phone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ExtendedBadge } from '@/components/ui/extended-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  // Datos de prueba para personal
  const staffMembers = [
    { id: 1, name: 'Dr. Roberto Méndez', role: 'veterinarian', email: 'roberto@vetcare.com', phone: '555-1234', specialty: 'Medicina general', status: 'active' },
    { id: 2, name: 'Dra. Laura Fernández', role: 'veterinarian', email: 'laura@vetcare.com', phone: '555-5678', specialty: 'Cirugía', status: 'active' },
    { id: 3, name: 'Ana Martínez', role: 'receptionist', email: 'ana@vetcare.com', phone: '555-9012', specialty: 'N/A', status: 'active' },
    { id: 4, name: 'Carlos Jiménez', role: 'receptionist', email: 'carlos@vetcare.com', phone: '555-3456', specialty: 'N/A', status: 'inactive' },
    { id: 5, name: 'Dra. Sofía Ruiz', role: 'veterinarian', email: 'sofia@vetcare.com', phone: '555-7890', specialty: 'Dermatología', status: 'active' },
  ];

  // Filtrar personal por término de búsqueda
  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener el nombre del rol en español
  const getRoleName = (role: string) => {
    switch (role) {
      case 'veterinarian': return 'Veterinario';
      case 'receptionist': return 'Recepcionista';
      case 'admin': return 'Administrador';
      default: return role;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Personal</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo Empleado
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, rol o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {isMobile ? (
        <div className="space-y-4">
          {filteredStaff.map(staff => (
            <Card key={staff.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{staff.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{staff.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{getRoleName(staff.role)}</p>
                    </div>
                  </div>
                  <ExtendedBadge variant={staff.status === 'active' ? 'success' : 'outline'}>
                    {staff.status === 'active' ? 'Activo' : 'Inactivo'}
                  </ExtendedBadge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.phone}</span>
                  </div>
                  {staff.specialty !== 'N/A' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Especialidad:</span>
                      <span>{staff.specialty}</span>
                    </div>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" className="flex-1">Editar</Button>
                    <Button variant="outline" className="flex-1">Ver horario</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map(staff => (
                  <TableRow key={staff.id}>
                    <TableCell>{staff.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{staff.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {staff.name}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleName(staff.role)}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>{staff.specialty}</TableCell>
                    <TableCell>
                      <ExtendedBadge variant={staff.status === 'active' ? 'success' : 'outline'}>
                        {staff.status === 'active' ? 'Activo' : 'Inactivo'}
                      </ExtendedBadge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Ver horario</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Staff;
