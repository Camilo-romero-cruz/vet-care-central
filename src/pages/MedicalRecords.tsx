
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, FileText, Filter, X } from 'lucide-react';
import { PawIcon } from '@/components/icons/PawIcon';
import { useIsMobile } from '@/hooks/use-mobile';
import { ExtendedBadge } from '@/components/ui/extended-badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const MedicalRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    completado: true,
    enTratamiento: true,
  });
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Datos de prueba para historiales médicos
  const records = [
    { id: 1, petName: 'Max', petType: 'Perro', ownerName: 'Juan Pérez', date: '2023-04-01', diagnosis: 'Infección estomacal', status: 'Completado', treatment: 'Antibióticos y dieta blanda por 7 días', notes: 'Seguimiento en una semana' },
    { id: 2, petName: 'Luna', petType: 'Gato', ownerName: 'María García', date: '2023-04-02', diagnosis: 'Vacunación anual', status: 'Completado', treatment: 'Vacunas actualizadas', notes: 'Próxima vacunación en 1 año' },
    { id: 3, petName: 'Rocky', petType: 'Perro', ownerName: 'Pedro López', date: '2023-04-03', diagnosis: 'Fractura en pata', status: 'En tratamiento', treatment: 'Inmovilización y analgésicos', notes: 'Revisión en 2 semanas para ver evolución' },
    { id: 4, petName: 'Milo', petType: 'Conejo', ownerName: 'Ana Torres', date: '2023-04-05', diagnosis: 'Control de rutina', status: 'Completado', treatment: 'Sin tratamiento necesario', notes: 'Todo en orden' },
    { id: 5, petName: 'Nala', petType: 'Perro', ownerName: 'Carlos Ruiz', date: '2023-04-07', diagnosis: 'Dermatitis', status: 'En tratamiento', treatment: 'Champú medicado y antibióticos', notes: 'Revisión en 10 días' },
  ];

  // Filtrar registros por término de búsqueda y filtros activos
  const filteredRecords = records.filter(record => {
    // Filtro por texto de búsqueda
    const matchesSearchTerm = record.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por estado
    const matchesStatusFilter = 
      (record.status === 'Completado' && activeFilters.completado) ||
      (record.status === 'En tratamiento' && activeFilters.enTratamiento);
    
    return matchesSearchTerm && matchesStatusFilter;
  });

  // Manejar la visualización de detalles
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (filter, checked) => {
    setActiveFilters(prev => ({
      ...prev,
      [filter]: checked
    }));
  };

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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Estado</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="completado" 
                    checked={activeFilters.completado}
                    onCheckedChange={(checked) => handleFilterChange('completado', checked)} 
                  />
                  <Label htmlFor="completado">Completado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="enTratamiento" 
                    checked={activeFilters.enTratamiento}
                    onCheckedChange={(checked) => handleFilterChange('enTratamiento', checked)} 
                  />
                  <Label htmlFor="enTratamiento">En tratamiento</Label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
                  <ExtendedBadge variant={record.status === 'Completado' ? 'success' : 'secondary'}>
                    {record.status}
                  </ExtendedBadge>
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
                  <Button 
                    variant="outline" 
                    className="mt-2 w-full flex items-center justify-center gap-2"
                    onClick={() => handleViewDetails(record)}
                  >
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
                      <ExtendedBadge variant={record.status === 'Completado' ? 'success' : 'secondary'}>
                        {record.status}
                      </ExtendedBadge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleViewDetails(record)}
                      >
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

      {/* Dialog para mostrar detalles del historial médico */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Historial Médico - {selectedRecord?.petName}</DialogTitle>
            <DialogDescription>
              Detalles completos del historial médico
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Mascota</h4>
                  <p>{selectedRecord.petName} ({selectedRecord.petType})</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Propietario</h4>
                  <p>{selectedRecord.ownerName}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Fecha</h4>
                <p>{new Date(selectedRecord.date).toLocaleDateString('es-ES')}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Diagnóstico</h4>
                <p>{selectedRecord.diagnosis}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Tratamiento</h4>
                <p>{selectedRecord.treatment}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Notas</h4>
                <p>{selectedRecord.notes}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Estado</h4>
                <ExtendedBadge variant={selectedRecord.status === 'Completado' ? 'success' : 'secondary'}>
                  {selectedRecord.status}
                </ExtendedBadge>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalRecords;
