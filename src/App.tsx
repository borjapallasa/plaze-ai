
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Index from "./pages/index";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import SignInCommunity from "./pages/sign-in-community";
import SignUpCommunity from "./pages/sign-up-community";
import RecoverPassword from "./pages/RecoverPassword";
import PersonalArea from "./pages/PersonalArea";
import AccountSettings from "./pages/AccountSettings";
import Sell from "./pages/Sell";
import Product from "./pages/Product";
import EditProduct from "./pages/EditProduct";
import Expert from "./pages/Expert";
import Experts from "./pages/Experts";
import Community from "./pages/Community";
import CommunityAbout from "./pages/CommunityAbout";
import MyCommunities from "./pages/MyCommunities";
import EditCommunity from "./pages/EditCommunity";
import CommunityProduct from "./pages/CommunityProduct";
import NewCommunityPage from "./pages/seller/NewCommunityPage";
import NewCommunityProductPage from "./pages/community/NewCommunityProductPage";
import NewProduct from "./pages/seller/NewProduct";
import NewServicePage from "./pages/seller/NewServicePage";
import EditService from "./pages/EditService";
import SellerPage from "./pages/seller/SellerPage";
import SellerAboutPage from "./pages/seller/SellerAboutPage";
import Transactions from "./pages/Transactions";
import UserTransactionDetails from "./pages/UserTransactionDetails";
import UserTransactionItemDetails from "./pages/UserTransactionItemDetails";
import ThankYou from "./pages/ThankYou";
import Cart from "./pages/Cart";
import Chats from "./pages/Chats";
import Classroom from "./pages/Classroom";
import Affiliates from "./pages/Affiliates";
import Jobs from "./pages/Jobs";
import Job from "./pages/Job";
import Blog from "./pages/Blog";
import SearchPage from "./pages/search/index";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import AdminExperts from "./pages/admin/AdminExperts";
import AdminExpertDetails from "./pages/admin/AdminExpertDetails";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminTransactionDetails from "./pages/admin/AdminTransactionDetails";
import AdminTemplateDetails from "./pages/admin/AdminTemplateDetails";
import DraftTemplates from "./pages/admin/DraftTemplates";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in-community" element={<SignInCommunity />} />
              <Route path="/sign-up-community" element={<SignUpCommunity />} />
              <Route path="/recover-password" element={<RecoverPassword />} />
              <Route path="/personal-area" element={<PersonalArea />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/product/:slug" element={<Product />} />
              <Route path="/edit-product/:productId" element={<EditProduct />} />
              <Route path="/expert/:slug" element={<Expert />} />
              <Route path="/experts" element={<Experts />} />
              <Route path="/community/:slug" element={<Community />} />
              <Route path="/community/:slug/about" element={<CommunityAbout />} />
              <Route path="/my-communities" element={<MyCommunities />} />
              <Route path="/edit-community/:communityId" element={<EditCommunity />} />
              <Route path="/community/:slug/product/:productSlug" element={<CommunityProduct />} />
              <Route path="/seller/new-community" element={<NewCommunityPage />} />
              <Route path="/community/:slug/new-product" element={<NewCommunityProductPage />} />
              <Route path="/seller/new-product" element={<NewProduct />} />
              <Route path="/seller/new-service" element={<NewServicePage />} />
              <Route path="/edit-service/:serviceId" element={<EditService />} />
              <Route path="/seller/:sellerId" element={<SellerPage />} />
              <Route path="/seller/:sellerId/about" element={<SellerAboutPage />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transaction/:transactionId" element={<UserTransactionDetails />} />
              <Route path="/transaction/:transactionId/item/:itemId" element={<UserTransactionItemDetails />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/classroom" element={<Classroom />} />
              <Route path="/affiliates" element={<Affiliates />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/job/:jobId" element={<Job />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/users/:userId" element={<AdminUserDetails />} />
              <Route path="/admin/experts" element={<AdminExperts />} />
              <Route path="/admin/experts/:expertId" element={<AdminExpertDetails />} />
              <Route path="/admin/transactions" element={<AdminTransactions />} />
              <Route path="/admin/transactions/:transactionId" element={<AdminTransactionDetails />} />
              <Route path="/admin/templates/:templateId" element={<AdminTemplateDetails />} />
              <Route path="/admin/draft-templates" element={<DraftTemplates />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
