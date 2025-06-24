
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthProvider";
import IndexPage from "./pages/index";
import ProductPage from "./pages/Product";
import AuthPage from "./pages/auth";
import SignInCommunityPage from "./pages/sign-in-community";
import SignUpCommunityPage from "./pages/sign-up-community";
import NewProductPage from "./pages/seller/NewProduct";
import NewCommunityPage from "./pages/seller/NewCommunityPage";
import EditProductPage from "./pages/EditProduct";
import EditCommunityPage from "./pages/EditCommunity";
import CommunityPage from "./pages/Community";
import ClassroomPage from "./pages/Classroom";
import ChatsPage from "./pages/Chats";
import BlogPage from "./pages/Blog";
import CartPage from "./pages/Cart";
import PersonalAreaPage from "./pages/PersonalArea";
import AccountSettingsPage from "./pages/AccountSettings";
import ManageSubscriptionsPage from "./pages/ManageSubscriptions";
import MyCommunitiesPage from "./pages/MyCommunities";
import TransactionsPage from "./pages/Transactions";
import UserTransactionDetailsPage from "./pages/UserTransactionDetails";
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
import { SearchResults } from "./pages/search";
import NewCommunityProductPage from "./pages/community/NewCommunityProductPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/sign-in" element={<AuthPage />} />
          <Route path="/sign-up" element={<AuthPage />} />
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
          <Route path="/classroom/:id" element={<ClassroomPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/personal-area" element={<PersonalAreaPage />} />
          <Route path="/account/settings" element={<AccountSettingsPage />} />
          <Route path="/account/subscriptions" element={<ManageSubscriptionsPage />} />
          <Route path="/account/communities" element={<MyCommunitiesPage />} />
          <Route path="/account/transactions" element={<TransactionsPage />} />
          <Route path="/account/transactions/transaction/:id" element={<UserTransactionDetailsPage />} />
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
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
