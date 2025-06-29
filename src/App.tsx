
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthProvider";
import IndexPage from "./pages/index";
import ProductPage from "./pages/Product";
import SignInPage from "./pages/sign-in";
import SignUpPage from "./pages/sign-up";
import SignInCommunityPage from "./pages/sign-in-community";
import SignUpCommunityPage from "./pages/sign-up-community";
import NewProductPage from "./pages/seller/NewProduct";
import NewCommunityPage from "./pages/seller/NewCommunityPage";
import EditProductPage from "./pages/EditProduct";
import EditCommunityPage from "./pages/EditCommunity";
import CommunityPage from "./pages/Community";
import CommunityAboutPage from "./pages/CommunityAbout";
import CommunityProductPage from "./pages/CommunityProduct";
import ClassroomPage from "./pages/Classroom";
import ChatsPage from "./pages/Chats";
import BlogPage from "./pages/Blog";
import CartPage from "./pages/Cart";
import PersonalAreaPage from "./pages/PersonalArea";
import AccountSettingsPage from "./pages/AccountSettings";
import MyCommunitiesPage from "./pages/MyCommunities";
import TransactionsPage from "./pages/Transactions";
import UserTransactionDetailsPage from "./pages/UserTransactionDetails";
import UserTransactionItemDetails from "./pages/UserTransactionItemDetails";
import ThankYouPage from "./pages/ThankYou";
import RecoverPasswordPage from "./pages/RecoverPassword";
import AdminDashboardPage from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsers";
import AdminUserDetailsPage from "./pages/admin/AdminUserDetails";
import AdminExpertsPage from "./pages/admin/AdminExperts";
import AdminExpertDetailsPage from "./pages/admin/AdminExpertDetails";
import AdminTransactionsPage from "./pages/admin/AdminTransactions";
import AdminTransactionDetailsPage from "./pages/admin/AdminTransactionDetails";
import DraftTemplatesPage from "./pages/admin/DraftTemplates";
import AdminTemplateDetailsPage from "./pages/admin/AdminTemplateDetails";
import AffiliatesPage from "./pages/Affiliates";
import SellerPage from "./pages/seller/SellerPage";
import SellPage from "./pages/Sell";
import ExpertsPage from "./pages/Experts";
import ExpertPage from "./pages/Expert";
import { SearchResults } from "./pages/search";
import NewCommunityProductPage from "./pages/community/NewCommunityProductPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in/community/:id" element={<SignInCommunityPage />} />
          <Route path="/sign-up/community/:id" element={<SignUpCommunityPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/product/:slug/:id" element={<ProductPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/seller/products/new" element={<NewProductPage />} />
          <Route path="/seller/communities/new" element={<NewCommunityPage />} />
          <Route path="/seller/:id" element={<SellerPage />} />
          <Route path="/product/:id/edit" element={<EditProductPage />} />
          <Route path="/community/:id/edit" element={<EditCommunityPage />} />
          <Route path="/community/:id/products/new" element={<NewCommunityProductPage />} />
          <Route path="/community/:id" element={<CommunityPage />} />
          <Route path="/community/:id/about" element={<CommunityAboutPage />} />
          <Route path="/community/product/:id" element={<CommunityProductPage />} />
          <Route path="/classroom/:id" element={<ClassroomPage />} />
          <Route path="/account/chats" element={<ChatsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/personal-area" element={<PersonalAreaPage />} />
          <Route path="/account/settings" element={<AccountSettingsPage />} />
          <Route path="/account/communities" element={<MyCommunitiesPage />} />
          <Route path="/account/transactions" element={<TransactionsPage />} />
          <Route path="/account/transactions/transaction/:id" element={<UserTransactionDetailsPage />} />
          <Route path="/account/transactions/transaction/item/:id" element={<UserTransactionItemDetails />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/recover-password" element={<RecoverPasswordPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/users/user/:id" element={<AdminUserDetailsPage />} />
          <Route path="/admin/experts" element={<AdminExpertsPage />} />
          <Route path="/admin/experts/expert/:id" element={<AdminExpertDetailsPage />} />
          <Route path="/admin/admins/admin/:id" element={<AdminUserDetailsPage />} />
          <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
          <Route path="/admin/transaction/:id" element={<AdminTransactionDetailsPage />} />
          <Route path="/admin/products/draft" element={<DraftTemplatesPage />} />
          <Route path="/admin/product/:id" element={<AdminTemplateDetailsPage />} />
          <Route path="/affiliates" element={<AffiliatesPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/experts" element={<ExpertsPage />} />
          <Route path="/expert/:expert_uuid" element={<ExpertPage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
