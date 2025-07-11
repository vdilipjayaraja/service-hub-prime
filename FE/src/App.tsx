
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import LoginPage from "./components/Auth/LoginPage";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import ClientList from "./components/Clients/ClientList";
import ServiceRequestList from "./components/ServiceRequests/ServiceRequestList";
import ProfilePage from "./components/Profile/ProfilePage";
import SettingsPage from "./components/Settings/SettingsPage";
import DeviceManagement from "./components/Devices/DeviceManagement";
import CompanyAssets from "./components/Assets/CompanyAssets";
import TechnicianManagement from "./components/Technicians/TechnicianManagement";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clients" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ClientList />
          </ProtectedRoute>
        } />
        <Route path="devices" element={<DeviceManagement />} />
        <Route path="service-requests" element={
          <ProtectedRoute allowedRoles={['admin', 'technician']}>
            <ServiceRequestList />
          </ProtectedRoute>
        } />
        <Route path="my-requests" element={
          <ProtectedRoute allowedRoles={['client']}>
            <ServiceRequestList />
          </ProtectedRoute>
        } />
        <Route path="assets" element={
          <ProtectedRoute allowedRoles={['admin', 'technician']}>
            <CompanyAssets />
          </ProtectedRoute>
        } />
        <Route path="technicians" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <TechnicianManagement />
          </ProtectedRoute>
        } />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
