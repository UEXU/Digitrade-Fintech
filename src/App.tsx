/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useLocation } from 'react-router-dom';

const HomePage       = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const AdminLogin     = lazy(() => import('./pages/Admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const IndustryDetail = lazy(() => import('./pages/IndustryDetail').then(m => ({ default: m.IndustryDetail })));
const ProductMatrix  = lazy(() => import('./pages/ProductMatrix').then(m => ({ default: m.ProductMatrix })));

const ScrollToHash = () => {
  const { hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash]);

  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Suspense fallback={null}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductMatrix />} />
        <Route path="/industry/:id" element={<IndustryDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
