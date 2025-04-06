
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface MonthlyReportProps {
  data: {
    month: string;
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  }[];
  year: number;
}

export const MonthlyReportCard: React.FC<MonthlyReportProps> = ({ data, year }) => {
  const { hasFeatureAccess } = useAuth();
  const canAccessFinancialStats = hasFeatureAccess('financial_stats');
  
  // Calcular el total de ingresos
  const totalRevenue = data.reduce((acc, current) => acc + current.paid, 0);
  const totalPending = data.reduce((acc, current) => acc + current.pending, 0);
  const totalOverdue = data.reduce((acc, current) => acc + current.overdue, 0);

  if (!canAccessFinancialStats) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Reporte de Ingresos Mensuales</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No tienes permisos para ver las estadísticas financieras. Esta información está disponible solo para administradores.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reporte de Ingresos Mensuales {year}</CardTitle>
        <CardDescription>
          Total facturado: ${totalRevenue.toFixed(2)} • 
          Pendiente: ${totalPending.toFixed(2)} •
          Vencido: ${totalOverdue.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Bar name="Pagado" dataKey="paid" fill="#10b981" />
              <Bar name="Pendiente" dataKey="pending" fill="#f59e0b" />
              <Bar name="Vencido" dataKey="overdue" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
