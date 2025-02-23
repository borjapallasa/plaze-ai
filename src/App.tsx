
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Index from "./pages/index";
import Product from "./pages/Product";
import Products from "./pages/Products";
import Expert from "./pages/Expert";
import Experts from "./pages/Experts";
import Community from "./pages/Community";
import Communities from "./pages/Communities";
import SignUp from "./pages/sign-up";
import SignUpCommunity from "./pages/sign-up-community";
import SignIn from "./pages/sign-in";
import SignInCommunity from "./pages/sign-in-community";
import RecoverPassword from "./pages/RecoverPassword";
import Classroom from "./pages/Classroom";
import Jobs from "./pages/Jobs";
import Job from "./pages/Job";
import ManageSubscriptions from "./pages/ManageSubscriptions";
import Blog from "./pages/Blog";
import Affiliates from "./pages/Affiliates";
import PersonalArea from "./pages/PersonalArea";
import Transactions from "./pages/Transactions";
import AccountSettings from "./pages/AccountSettings";
import Chats from "./pages/Chats";
import ThankYou from "./pages/ThankYou";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import MyCommunities from "./pages/MyCommunities";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminTransactionDetails from "./pages/admin/AdminTransactionDetails";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import AdminExperts from "./pages/admin/AdminExperts";
import AdminTemplateDetails from "./pages/admin/AdminTemplateDetails";
import DraftTemplates from "./pages/admin/DraftTemplates";
import { Footer } from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/products" element={<Products />} />
            <Route path="/expert" element={<Expert />} />
            <Route path="/experts" element={<Experts />} />
            <Route path="/community" element={<Community />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/my-communities" element={<MyCommunities />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-up/community" element={<SignUpCommunity />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-in/community" element={<SignInCommunity />} />
            <Route path="/recover-password" element={<RecoverPassword />} />
            <Route path="/community/classroom" element={<Classroom />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:id" element={<Job />} />
            <Route path="/manage-subscriptions" element={<ManageSubscriptions />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/affiliates" element={<Affiliates />} />
            <Route path="/personal-area" element={<PersonalArea />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/seller/product" element={<EditProduct />} />
            <Route path="/a/admin" element={<AdminDashboard />} />
            <Route path="/a/admin/transactions" element={<AdminTransactions />} />
            <Route path="/a/admin/transactions/:id" element={<AdminTransactionDetails />} />
            <Route path="/a/admin/draft-templates" element={<DraftTemplates />} />
            <Route path="/a/admin/templates/:id" element={<AdminTemplateDetails />} />
            <Route path="/a/admin/users" element={<AdminUsers />} />
            <Route path="/a/admin/users/:id" element={<AdminUserDetails />} />
            <Route path="/a/admin/experts" element={<AdminExperts />} />
          </Routes>
          <Footer />
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
