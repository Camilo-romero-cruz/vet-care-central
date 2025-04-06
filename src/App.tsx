
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Pets from "./pages/Pets";
import MedicalRecords from "./pages/MedicalRecords";
import Clients from "./pages/Clients";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Billing from "./pages/Billing";

// Components
import { ProtectedLayout } from "./components/Layout";
import { UserRole } from "./types";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes for all users */}
            <Route element={<ProtectedLayout allowedRoles={['admin', 'veterinarian', 'receptionist', 'client']} />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/pets" element={<Pets />} />
            </Route>
            
            {/* Routes for admin and veterinarians */}
            <Route element={<ProtectedLayout allowedRoles={['admin', 'veterinarian']} />}>
              <Route path="/records" element={<MedicalRecords />} />
            </Route>
            
            {/* Routes for admin and receptionists */}
            <Route element={<ProtectedLayout allowedRoles={['admin', 'receptionist']} />}>
              <Route path="/clients" element={<Clients />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/billing" element={<Billing />} />
            </Route>
            
            {/* Routes only for admin */}
            <Route element={<ProtectedLayout allowedRoles={['admin']} />}>
              <Route path="/staff" element={<Staff />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* Default redirect to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
