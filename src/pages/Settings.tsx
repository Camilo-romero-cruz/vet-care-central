
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useIsMobile } from '@/hooks/use-mobile';

const Settings = () => {
  const isMobile = useIsMobile();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Configuración</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'w-[400px] grid-cols-4'}`}>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          {!isMobile && <TabsTrigger value="security">Seguridad</TabsTrigger>}
          {!isMobile && <TabsTrigger value="backups">Respaldos</TabsTrigger>}
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Clínica</CardTitle>
                <CardDescription>
                  Configure la información básica de su clínica veterinaria.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="clinic-name">Nombre de la Clínica</Label>
                  <Input id="clinic-name" defaultValue="VetCare Central" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" defaultValue="Av. Principal #123, Ciudad" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" defaultValue="555-1234" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="contacto@vetcare.com" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="schedule">Horario de Atención</Label>
                  <Input id="schedule" defaultValue="Lunes a Viernes: 9:00 - 18:00, Sábados: 9:00 - 13:00" />
                </div>
                
                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>
                  Personalice la apariencia de la aplicación.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme-toggle">Modo Oscuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Cambiar entre tema claro y oscuro
                    </p>
                  </div>
                  <Switch id="theme-toggle" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sidebar-toggle">Barra Lateral Compacta</Label>
                    <p className="text-sm text-muted-foreground">
                      Reducir el tamaño de la barra lateral
                    </p>
                  </div>
                  <Switch id="sidebar-toggle" />
                </div>
                
                <Button variant="outline">Restaurar Valores Predeterminados</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
                <CardDescription>
                  Configure cómo y cuándo desea recibir notificaciones.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Notificaciones por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibir notificaciones por correo electrónico
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="appointment-reminders">Recordatorios de Citas</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar recordatorios de citas a clientes
                      </p>
                    </div>
                    <Switch id="appointment-reminders" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="inventory-alerts">Alertas de Inventario</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar cuando productos tengan stock bajo
                      </p>
                    </div>
                    <Switch id="inventory-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="schedule-updates">Actualizaciones de Horario</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar cambios en el horario de personal
                      </p>
                    </div>
                    <Switch id="schedule-updates" />
                  </div>
                </div>
                
                <Button>Guardar Preferencias</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Seguridad de la Cuenta</CardTitle>
                <CardDescription>
                  Administre la seguridad de su cuenta y configure opciones de autenticación.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Contraseña Actual</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <Button>Cambiar Contraseña</Button>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor">Autenticación de Dos Factores</Label>
                      <p className="text-sm text-muted-foreground">
                        Añade una capa extra de seguridad a tu cuenta
                      </p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backups">
            <Card>
              <CardHeader>
                <CardTitle>Respaldos de Datos</CardTitle>
                <CardDescription>
                  Configure respaldos automáticos y gestione copias de seguridad existentes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-backup">Respaldos Automáticos</Label>
                    <p className="text-sm text-muted-foreground">
                      Realizar respaldos automáticos diariamente
                    </p>
                  </div>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                
                <div className="grid gap-2">
                  <Label>Frecuencia de Respaldo</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline">Diario</Button>
                    <Button variant="outline">Semanal</Button>
                    <Button variant="outline">Mensual</Button>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <Button className="w-full">Crear Respaldo Manual</Button>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-medium mb-2">Respaldos Recientes</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Respaldo 2023-04-01.zip</span>
                      <Button variant="ghost" size="sm">Descargar</Button>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Respaldo 2023-03-25.zip</span>
                      <Button variant="ghost" size="sm">Descargar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
