import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorProvider } from './context/ErrorContext';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorDisplay from './components/ErrorDisplay';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TopicTracker from './pages/TopicTracker';
import ProblemManager from './pages/ProblemManager';
import CompanyPrep from './pages/CompanyPrep';
import MockPlanner from './pages/MockPlanner';
import Notes from './pages/Notes';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-dark-950 text-dark-50">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <AuthProvider>
          <BrowserRouter>
            <ErrorDisplay />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/topics" element={
                <ProtectedRoute>
                  <Layout><TopicTracker /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/problems" element={
                <ProtectedRoute>
                  <Layout><ProblemManager /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/companies" element={
                <ProtectedRoute>
                  <Layout><CompanyPrep /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/mock-interviews" element={
                <ProtectedRoute>
                  <Layout><MockPlanner /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/notes" element={
                <ProtectedRoute>
                  <Layout><Notes /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Layout><AdminPanel /></Layout>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;
