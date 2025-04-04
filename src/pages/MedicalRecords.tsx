
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Filter } from 'lucide-react';
import { PawIcon } from '@/components/icons/PawIcon';
import { useIsMobile } from '@/hooks/use-mobile';

const MedicalRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  // Datos de prueba para historiales médicos
  const records = [
    { id: 1, petName: 'Max', petType: 'Perro', ownerName: 'Juan Pérez', date: '2023-04-01', diagnosis: 'Infección estomacal', status: 'Completado' },
    { id: 2, petName: 'Luna', petType: 'Gato', ownerName: 'María García', date: '2023-04-02', diagnosis: 'Vacunación anual', status: 'Completado' },
    { id: 3, petName: 'Rocky', petType: 'Perro', ownerName: 'Pedro López', date: '2023-04-03', diagnosis: 'Fractura en pata', status: 'En tratamiento' },
    { id: 4, petName: 'Milo', petType: 'Conejo', ownerName: 'Ana Torres', date: '2023-04-05', diagnosis: 'Control de rutina', status: 'Completado' },
    { id: 5, petName: 'Nala', petType: 'Perro', ownerName: 'Carlos Ruiz', date: '2023-04-07', diagnosis: 'Dermatitis', status: 'En tratamiento' },
  ];

  // Filtrar registros por término de búsqueda
  const filteredRecords = records.filter(record => 
    record.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Historiales Médicos</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por mascota, propietario o diagnóstico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>
      
      {isMobile ? (
        <div className="space-y-4">
          {filteredRecords.map(record => (
            <Card key={record.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PawIcon className="h-5 w-5 text-primary" />
                    {record.petName}
                  </CardTitle>
                  <Badge variant={record.status === 'Completado' ? 'success' : 'secondary'}>
                    {record.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Propietario:</span>
                    <span>{record.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span>{record.petType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha:</span>
                    <span>{new Date(record.date).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diagnóstico:</span>
                    <span>{record.diagnosis}</span>
                  </div>
                  <Button variant="outline" className="mt-2 w-full flex items-center justify-center gap-2">
                    <FileText className="h-4 w-4" /> Ver detalles
                  </Button>
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
                  <TableHead>Mascota</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Propietario</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Diagnóstico</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map(record => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell className="font-medium">{record.petName}</TableCell>
                    <TableCell>{record.petType}</TableCell>
                    <TableCell>{record.ownerName}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString('es-ES')}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>
                      <Badge variant={record.status === 'Completado' ? 'success' : 'secondary'}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" /> Detalles
                      </Button>
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

export default MedicalRecords;
