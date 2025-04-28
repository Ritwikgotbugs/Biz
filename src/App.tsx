import Layout from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/lib/auth";
import Chatbot from "@/pages/Chatbot";
import Dashboard from "@/pages/Dashboard";
import HowItWorks from "@/pages/HowItWorks";
import Index from "@/pages/Index";
import KnowledgeBase from "@/pages/KnowledgeBase";
import Login from "@/pages/Login";
import Onboarding from "@/pages/Onboarding";
import Resources from "@/pages/Resources";
import Signup from "@/pages/Signup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";

// Create a client
const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, isOnboarded } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If user is already onboarded and trying to access onboarding page, redirect to dashboard
  if (isOnboarded && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard/general" replace />;
  }
  
  // If user is not onboarded and trying to access protected routes (except onboarding)
  if (!isOnboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/dashboard/:category" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/knowledge-base" element={
                <ProtectedRoute>
                  <KnowledgeBase />
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              } />
              <Route path="/chatbot" element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
