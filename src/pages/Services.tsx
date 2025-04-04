
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Stethoscope } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  // Datos de prueba para servicios
  const services = [
    { id: 1, name: 'Consulta general', description: 'Examen físico general y diagnóstico', duration: 30, price: 35.00 },
    { id: 2, name: 'Vacunación', description: 'Administración de vacunas según calendario', duration: 15, price: 25.00 },
    { id: 3, name: 'Cirugía menor', description: 'Procedimientos quirúrgicos menores', duration: 60, price: 120.00 },
    { id: 4, name: 'Limpieza dental', description: 'Eliminación de sarro y limpieza completa', duration: 45, price: 80.00 },
    { id: 5, name: 'Análisis de sangre', description: 'Análisis completo de sangre', duration: 20, price: 45.00 },
  ];

  // Filtrar servicios por término de búsqueda
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Servicios</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo Servicio
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {isMobile ? (
        <div className="space-y-4">
          {filteredServices.map(service => (
            <Card key={service.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  {service.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración:</span>
                    <span>{service.duration} minutos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio:</span>
                    <span>${service.price.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" className="flex-1">Editar</Button>
                    <Button className="flex-1">Agendar</Button>
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
                  <TableHead>Descripción</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map(service => (
                  <TableRow key={service.id}>
                    <TableCell>{service.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-primary" />
                        {service.name}
                      </div>
                    </TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>{service.duration} minutos</TableCell>
                    <TableCell>${service.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button size="sm">Agendar</Button>
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

export default Services;
