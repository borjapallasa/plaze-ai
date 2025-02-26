import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import SellerServices from "./pages/SellerServices";
import NewService from "./pages/NewService";
import EditService from "./pages/EditService";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import SellerProfile from "./pages/SellerProfile";
import SellerEditProfile from "./pages/SellerEditProfile";
import SellerCommunities from "./pages/SellerCommunities";
import NewCommunity from "./pages/NewCommunity";
import EditCommunity from "./pages/EditCommunity";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/seller/services" element={<SellerServices />} />
        <Route path="/seller/services/new" element={<NewService />} />
        <Route path="/service/:id/edit" element={<EditService />} />
        <Route path="/seller/profile" element={<SellerProfile />} />
        <Route path="/seller/profile/edit" element={<SellerEditProfile />} />
        <Route path="/seller/communities" element={<SellerCommunities />} />
        <Route path="/seller/communities/new" element={<NewCommunity />} />
        <Route path="/community/:id/edit" element={<EditCommunity />} />
      </Routes>
    </Router>
  );
}
