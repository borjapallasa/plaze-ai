
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
import ExpertsPage from "./pages/Experts";
import ExpertPage from "./pages/Expert";
import ProductsPage from "./pages/Products";
import NewProductPage from "./pages/seller/NewProduct";
import EditProductPage from "./pages/EditProduct";
import EditServicePage from "./pages/EditService";
import EditCommunityPage from "./pages/EditCommunity";
import CommunitiesPage from "./pages/Communities";
import CommunityPage from "./pages/Community";
import ClassroomPage from "./pages/Classroom";
import ChatsPage from "./pages/Chats";
import JobsPage from "./pages/Jobs";
import JobPage from "./pages/Job";
import BlogPage from "./pages/Blog";
import CartPage from "./pages/Cart";
import PersonalAreaPage from "./pages/PersonalArea";
import AccountSettingsPage from "./pages/AccountSettings";
import ManageSubscriptionsPage from "./pages/ManageSubscriptions";
import MyCommunitiesPage from "./pages/MyCommunities";
import TransactionsPage from "./pages/Transactions";
import ThankYouPage from "./pages/ThankYou";
import RecoverPasswordPage from "./pages/RecoverPassword";
import AdminDashboardPage from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsers";
import AdminUserDetailsPage from "./pages/admin/AdminUserDetails";
import AdminExpertsPage from "./pages/admin/AdminExperts";
import AdminTransactionsPage from "./pages/admin/AdminTransactions";
import AdminTransactionDetailsPage from "./pages/admin/AdminTransactionDetails";
import DraftTemplatesPage from "./pages/admin/DraftTemplates";
import AdminTemplateDetailsPage from "./pages/admin/AdminTemplateDetails";
import AffiliatesPage from "./pages/Affiliates";
import SellerPage from "./pages/seller/SellerPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in-community" element={<SignInCommunityPage />} />
          <Route path="/sign-up-community" element={<SignUpCommunityPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/experts" element={<ExpertsPage />} />
          <Route path="/expert/:id" element={<ExpertPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/seller/products/new" element={<NewProductPage />} />
          <Route path="/seller/:id" element={<SellerPage />} />
          <Route path="/product/:id/edit" element={<EditProductPage />} />
          <Route path="/service/:id/edit" element={<EditServicePage />} />
          <Route path="/community/:id/edit" element={<EditCommunityPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/community/:id" element={<CommunityPage />} />
          <Route path="/classroom/:id" element={<ClassroomPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/job/:id" element={<JobPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/account" element={<PersonalAreaPage />} />
          <Route path="/account/settings" element={<AccountSettingsPage />} />
          <Route path="/account/subscriptions" element={<ManageSubscriptionsPage />} />
          <Route path="/account/communities" element={<MyCommunitiesPage />} />
          <Route path="/account/transactions" element={<TransactionsPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/recover-password" element={<RecoverPasswordPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/user/:id" element={<AdminUserDetailsPage />} />
          <Route path="/admin/experts" element={<AdminExpertsPage />} />
          <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
          <Route path="/admin/transaction/:id" element={<AdminTransactionDetailsPage />} />
          <Route path="/admin/templates/draft" element={<DraftTemplatesPage />} />
          <Route path="/admin/template/:id" element={<AdminTemplateDetailsPage />} />
          <Route path="/affiliates" element={<AffiliatesPage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
