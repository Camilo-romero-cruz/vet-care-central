
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, User, MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ExtendedBadge } from '@/components/ui/extended-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  // Datos de prueba para clientes
  const clients = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '555-1234', pets: 2, lastVisit: '2023-04-01', status: 'active' },
    { id: 2, name: 'María García', email: 'maria@example.com', phone: '555-5678', pets: 1, lastVisit: '2023-03-15', status: 'active' },
    { id: 3, name: 'Pedro López', email: 'pedro@example.com', phone: '555-9012', pets: 3, lastVisit: '2023-02-28', status: 'inactive' },
    { id: 4, name: 'Ana Torres', email: 'ana@example.com', phone: '555-3456', pets: 1, lastVisit: '2023-03-20', status: 'active' },
    { id: 5, name: 'Carlos Ruiz', email: 'carlos@example.com', phone: '555-7890', pets: 2, lastVisit: '2023-01-15', status: 'inactive' },
  ];

  // Filtrar clientes por término de búsqueda
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo Cliente
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {isMobile ? (
        <div className="space-y-4">
          {filteredClients.map(client => (
            <Card key={client.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                  </div>
                  <ExtendedBadge variant={client.status === 'active' ? 'success' : 'outline'}>
                    {client.status === 'active' ? 'Activo' : 'Inactivo'}
                  </ExtendedBadge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{client.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mascotas:</span>
                    <span>{client.pets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última visita:</span>
                    <span>{new Date(client.lastVisit).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" className="flex-1">Ver mascotas</Button>
                    <Button variant="outline" className="flex-1">Editar</Button>
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
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Mascotas</TableHead>
                  <TableHead>Última visita</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map(client => (
                  <TableRow key={client.id}>
                    <TableCell>{client.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {client.name}
                      </div>
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.pets}</TableCell>
                    <TableCell>{new Date(client.lastVisit).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell>
                      <ExtendedBadge variant={client.status === 'active' ? 'success' : 'outline'}>
                        {client.status === 'active' ? 'Activo' : 'Inactivo'}
                      </ExtendedBadge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver mascotas
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
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

export default Clients;
