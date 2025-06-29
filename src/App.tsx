import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { CartProvider } from './components/cart/CartContext';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import PersonalArea from './pages/PersonalArea';
import SellPage from './pages/SellPage';
import AffiliatesPage from './pages/AffiliatesPage';
import AdminPage from './pages/AdminPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminExpertsPage from './pages/AdminExpertsPage';
import AdminCommunitiesPage from './pages/AdminCommunitiesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminProductEditPage from './pages/AdminProductEditPage';
import AdminExpertEditPage from './pages/AdminExpertEditPage';
import AdminCommunityEditPage from './pages/AdminCommunityEditPage';
import AdminTemplateEditPage from './pages/AdminTemplateEditPage';
import AdminTemplatesPage from './pages/AdminTemplatesPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage';
import AdminProductCreatePage from './pages/AdminProductCreatePage';
import AdminExpertCreatePage from './pages/AdminExpertCreatePage';
import AdminCommunityCreatePage from './pages/AdminCommunityCreatePage';
import ExpertPage from './pages/ExpertPage';
import CommunityPage from './pages/CommunityPage';
import ChatPage from './pages/ChatPage';
import SellerPage from "./pages/seller/SellerPage";
import SellerAboutPage from "./pages/seller/SellerAboutPage";
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/personal-area" element={<ProtectedRoute><PersonalArea /></ProtectedRoute>} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/affiliates" element={<AffiliatesPage />} />
              <Route path="/expert/:id" element={<ExpertPage />} />
              <Route path="/community/:id" element={<CommunityPage />} />
              <Route path="/account/chats" element={<ChatPage />} />

              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute requiredRole="admin"><AdminProductsPage /></ProtectedRoute>} />
              <Route path="/admin/products/create" element={<ProtectedRoute requiredRole="admin"><AdminProductCreatePage /></ProtectedRoute>} />
              <Route path="/admin/products/:id" element={<ProtectedRoute requiredRole="admin"><AdminProductEditPage /></ProtectedRoute>} />
              <Route path="/admin/experts" element={<ProtectedRoute requiredRole="admin"><AdminExpertsPage /></ProtectedRoute>} />
              <Route path="/admin/experts/create" element={<ProtectedRoute requiredRole="admin"><AdminExpertCreatePage /></ProtectedRoute>} />
              <Route path="/admin/experts/:id" element={<ProtectedRoute requiredRole="admin"><AdminExpertEditPage /></ProtectedRoute>} />
              <Route path="/admin/communities" element={<ProtectedRoute requiredRole="admin"><AdminCommunitiesPage /></ProtectedRoute>} />
              <Route path="/admin/communities/create" element={<ProtectedRoute requiredRole="admin"><AdminCommunityCreatePage /></ProtectedRoute>} />
              <Route path="/admin/communities/:id" element={<ProtectedRoute requiredRole="admin"><AdminCommunityEditPage /></ProtectedRoute>} />
              <Route path="/admin/templates" element={<ProtectedRoute requiredRole="admin"><AdminTemplatesPage /></ProtectedRoute>} />
              <Route path="/admin/templates/:id" element={<ProtectedRoute requiredRole="admin"><AdminTemplateEditPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsersPage /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><AdminOrdersPage /></ProtectedRoute>} />
              <Route path="/admin/orders/:id" element={<ProtectedRoute requiredRole="admin"><AdminOrderDetailPage /></ProtectedRoute>} />
              
              <Route path="/seller/:id" element={<SellerPage />} />
              <Route path="/seller/:id/about" element={<SellerAboutPage />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
