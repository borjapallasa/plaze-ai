
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/context/CartContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Communities from "./pages/Communities";
import Community from "./pages/Community";
import CommunityAbout from "./pages/CommunityAbout";
import CommunitySubscriptions from "./pages/CommunitySubscriptions";
import CommunityCreate from "./pages/CommunityCreate";
import CommunityEdit from "./pages/CommunityEdit";
import CommunityJoin from "./pages/CommunityJoin";
import Experts from "./pages/Experts";
import ExpertProfile from "./pages/ExpertProfile";
import ExpertOnboarding from "./pages/ExpertOnboarding";
import ExpertDashboard from "./pages/ExpertDashboard";
import ExpertDashboardCommunitiesPage from "./pages/ExpertDashboardCommunitiesPage";
import ExpertDashboardCommunityPage from "./pages/ExpertDashboardCommunityPage";
import ExpertDashboardCommunityEditPage from "./pages/ExpertDashboardCommunityEditPage";
import ExpertDashboardClassroomPage from "./pages/ExpertDashboardClassroomPage";
import ExpertDashboardClassroomEditPage from "./pages/ExpertDashboardClassroomEditPage";
import ExpertServices from "./pages/ExpertServices";
import ExpertServiceEdit from "./pages/ExpertServiceEdit";
import ExpertServiceCreate from "./pages/ExpertServiceCreate";
import ExpertServiceType from "./pages/ExpertServiceType";
import NewProduct from "./pages/seller/NewProduct";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProduct from "./pages/seller/SellerProduct";
import SellerCommunity from "./pages/seller/SellerCommunity";
import SellerCommunityForm from "./pages/seller/SellerCommunityForm";
import SellerCommunityClassroom from "./pages/seller/SellerCommunityClassroom";
import SellerCommunityClassroomForm from "./pages/seller/SellerCommunityClassroomForm";
import SellerCommunityClassroomLesson from "./pages/seller/SellerCommunityClassroomLesson";
import SellerCommunityClassroomLessonForm from "./pages/seller/SellerCommunityClassroomLessonForm";
import SellerCommunityClassroomLessonEdit from "./pages/seller/SellerCommunityClassroomLessonEdit";
import SellerCommunityProduct from "./pages/seller/SellerCommunityProduct";
import SellerCommunityProductForm from "./pages/seller/SellerCommunityProductForm";
import SellerCommunityProductEdit from "./pages/seller/SellerCommunityProductEdit";
import SellerCommunityMember from "./pages/seller/SellerCommunityMember";
import SellerCommunityThread from "./pages/seller/SellerCommunityThread";
import SellerCommunityThreadForm from "./pages/seller/SellerCommunityThreadForm";
import SellerCommunityThreadEdit from "./pages/seller/SellerCommunityThreadEdit";
import SellerCommunityThreadMessage from "./pages/seller/SellerCommunityThreadMessage";
import SellerCommunityThreadMessageForm from "./pages/seller/SellerCommunityThreadMessageForm";
import SellerCommunityThreadMessageEdit from "./pages/seller/SellerCommunityThreadMessageEdit";
import SellerCommunityEdit from "./pages/seller/SellerCommunityEdit";
import SellerCommunityClassroomEdit from "./pages/seller/SellerCommunityClassroomEdit";
import SellerCommunityClassroomLessonDetail from "./pages/seller/SellerCommunityClassroomLessonDetail";
import SellerCommunityClassroomLessonLesson from "./pages/seller/SellerCommunityClassroomLessonLesson";
import SellerCommunityClassroomLessonTutorial from "./pages/seller/SellerCommunityClassroomLessonTutorial";
import SellerCommunityClassroomLessonTutorialForm from "./pages/seller/SellerCommunityClassroomLessonTutorialForm";
import SellerCommunityClassroomLessonTutorialEdit from "./pages/seller/SellerCommunityClassroomLessonTutorialEdit";
import Product from "./pages/Product";
import ProductEdit from "./pages/ProductEdit";
import CommunityProduct from "./pages/CommunityProduct";
import Classroom from "./pages/Classroom";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Affiliates from "./pages/Affiliates";
import Category from "./pages/Category";
import Search from "./pages/Search";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminTemplate from "./pages/admin/AdminTemplate";
import AdminExperts from "./pages/admin/AdminExperts";
import AdminUsers from "./pages/admin/AdminUsers";
import SellLayout from "./components/sell/SellLayout";
import SellType from "./pages/sell/SellType";
import SellExpert from "./pages/sell/SellExpert";
import SellCommunity from "./pages/sell/SellCommunity";
import SellCommunityType from "./pages/sell/SellCommunityType";
import SellCommunityBasic from "./pages/sell/SellCommunityBasic";
import SellCommunityPrivate from "./pages/sell/SellCommunityPrivate";
import SellCommunityClassroom from "./pages/sell/SellCommunityClassroom";
import SellCommunityClassroomBasic from "./pages/sell/SellCommunityClassroomBasic";
import SellCommunityClassroomPrivate from "./pages/sell/SellCommunityClassroomPrivate";
import SellProduct from "./pages/sell/SellProduct";
import SellProductType from "./pages/sell/SellProductType";
import SellProductDigital from "./pages/sell/SellProductDigital";
import SellProductSubscription from "./pages/sell/SellProductSubscription";
import SellProductBasic from "./pages/sell/SellProductBasic";
import SellProductPrivate from "./pages/sell/SellProductPrivate";
import SellService from "./pages/sell/SellService";
import SellServiceType from "./pages/sell/SellServiceType";
import SellServiceBasic from "./pages/sell/SellServiceBasic";
import SellServicePrivate from "./pages/sell/SellServicePrivate";
import PaymentStatus from "./pages/PaymentStatus";
import Service from "./pages/Service";
import ServiceOrder from "./pages/ServiceOrder";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <SidebarProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/profile" element={<Profile />} />
                  
                  <Route path="/communities" element={<Communities />} />
                  <Route path="/community/:id" element={<Community />} />
                  <Route path="/community/:id/about" element={<CommunityAbout />} />
                  <Route path="/community/:id/subscriptions" element={<CommunitySubscriptions />} />
                  <Route path="/community/create" element={<CommunityCreate />} />
                  <Route path="/community/:id/edit" element={<CommunityEdit />} />
                  <Route path="/community/:id/join" element={<CommunityJoin />} />
                  <Route path="/community/product/:id" element={<CommunityProduct />} />
                  
                  <Route path="/experts" element={<Experts />} />
                  <Route path="/expert/:id" element={<ExpertProfile />} />
                  <Route path="/expert/onboarding" element={<ExpertOnboarding />} />
                  <Route path="/expert/dashboard" element={<ExpertDashboard />} />
                  <Route path="/expert/dashboard/communities" element={<ExpertDashboardCommunitiesPage />} />
                  <Route path="/expert/dashboard/community/:id" element={<ExpertDashboardCommunityPage />} />
                  <Route path="/expert/dashboard/community/:id/edit" element={<ExpertDashboardCommunityEditPage />} />
                  <Route path="/expert/dashboard/community/:id/classroom/:classroomId" element={<ExpertDashboardClassroomPage />} />
                  <Route path="/expert/dashboard/community/:id/classroom/:classroomId/edit" element={<ExpertDashboardClassroomEditPage />} />
                  <Route path="/expert/services" element={<ExpertServices />} />
                  <Route path="/expert/services/:id/edit" element={<ExpertServiceEdit />} />
                  <Route path="/expert/services/create" element={<ExpertServiceCreate />} />
                  <Route path="/expert/services/type" element={<ExpertServiceType />} />
                  
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />
                  <Route path="/seller/product/new" element={<NewProduct />} />
                  <Route path="/seller/product/:id" element={<SellerProduct />} />
                  <Route path="/seller/community/:id" element={<SellerCommunity />} />
                  <Route path="/seller/community/:id/form" element={<SellerCommunityForm />} />
                  <Route path="/seller/community/:id/classroom/:classroomId" element={<SellerCommunityClassroom />} />
                  <Route path="/seller/community/:id/classroom/:classroomId/form" element={<SellerCommunityClassroomForm />} />
                  <Route path="/seller/community/:id/classroom/:classroomId/lesson/:lessonId" element={<SellerCommunityClassroomLesson />} />
                  <Route path="/seller/community/:id/classroom/:classroomId/lesson/:lessonId/form" element={<SellerCommunityClassroomLessonForm />} />
                  <Route path="/seller/community/:id/classroom/:classroomId/lesson/:lessonId/edit" element={<SellerCommunityClassroomLessonEdit />} />
                  <Route path="/seller/community/:id/product/:productId" element={<SellerCommunityProduct />} />
                  <Route path="/seller/community/:id/product/:productId/form" element={<SellerCommunityProductForm />} />
                  <Route path="/seller/community/:id/product/:productId/edit" element={<SellerCommunityProductEdit />} />
                  <Route path="/seller/community/:id/member/:memberId" element={<SellerCommunityMember />} />
                  <Route path="/seller/community/:id/thread/:threadId" element={<SellerCommunityThread />} />
                  <Route path="/seller/community/:id/thread/:threadId/form" element={<SellerCommunityThreadForm />} />
                  <Route path="/seller/community/:id/thread/:threadId/edit" element={<SellerCommunityThreadEdit />} />
                  <Route path="/seller/community/:id/thread/:threadId/message/:messageId" element={<SellerCommunityThreadMessage />} />
                  <Route path="/seller/community/:id/thread/:threadId/message/:messageId/form" element={<SellerCommunityThreadMessageForm />} />
                  <Route path="/seller/community/:id/thread/:threadId/message/:messageId/edit" element={<SellerCommunityThreadMessageEdit />} />
                  <Route path="/seller/community/:id/edit" element={<SellerCommunityEdit />} />
                  <Route path="/seller/community/:id/classroom/:classroomId/edit" element={<SellerCommunityClassroomEdit />} />
                  <Route path="/seller/community/:id/classroom/:classroomId/lesson/:lessonId/detail" element={<SellerCommunityClassroomLessonDetail />} />
                  <Route path="/seller/community/:id/classroom/:classroomId/lesson/:lessonId/lesson/:lessonLessonId" element={<SellerCommunityClassroomLessonLesson />} />
                  <Route path="/seller/community/:id/classroom/:classroomId/lesson/:lessonId/tutorial/:tutorialId" element={<SellerCommunityClassroomLessonTutorial />} />
                  <Route path="/seller/community/:id/classroom/:classroomId/lesson/:lessonId/tutorial/:tutorialId/form" element={<SellerCommunityClassroomLessonTutorialForm />} />
                  <Route path="/seller/community/:id/classroom/:classroomId/lesson/:lessonId/tutorial/:tutorialId/edit" element={<SellerCommunityClassroomLessonTutorialEdit />} />
                  
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/product/:id/edit" element={<ProductEdit />} />
                  <Route path="/classroom/:id" element={<Classroom />} />
                  
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/success" element={<CheckoutSuccess />} />
                  <Route path="/payment-status" element={<PaymentStatus />} />
                  
                  <Route path="/affiliates" element={<Affiliates />} />
                  <Route path="/category/:category" element={<Category />} />
                  <Route path="/search" element={<Search />} />
                  
                  <Route path="/admin/templates" element={<AdminTemplates />} />
                  <Route path="/admin/template/:id" element={<AdminTemplate />} />
                  <Route path="/admin/experts" element={<AdminExperts />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  
                  <Route path="/sell" element={<SellLayout currentStep={1}><SellType /></SellLayout>} />
                  <Route path="/sell/expert" element={<SellLayout currentStep={2}><SellExpert /></SellLayout>} />
                  <Route path="/sell/community" element={<SellLayout currentStep={3}><SellCommunity /></SellLayout>} />
                  <Route path="/sell/community/type" element={<SellLayout currentStep={4}><SellCommunityType /></SellLayout>} />
                  <Route path="/sell/community/basic" element={<SellLayout currentStep={5}><SellCommunityBasic /></SellLayout>} />
                  <Route path="/sell/community/private" element={<SellLayout currentStep={5}><SellCommunityPrivate /></SellLayout>} />
                  <Route path="/sell/community/classroom" element={<SellLayout currentStep={6}><SellCommunityClassroom /></SellLayout>} />
                  <Route path="/sell/community/classroom/basic" element={<SellLayout currentStep={7}><SellCommunityClassroomBasic /></SellLayout>} />
                  <Route path="/sell/community/classroom/private" element={<SellLayout currentStep={7}><SellCommunityClassroomPrivate /></SellLayout>} />
                  <Route path="/sell/product" element={<SellLayout currentStep={3}><SellProduct /></SellLayout>} />
                  <Route path="/sell/product/type" element={<SellLayout currentStep={4}><SellProductType /></SellLayout>} />
                  <Route path="/sell/product/digital" element={<SellLayout currentStep={5}><SellProductDigital /></SellLayout>} />
                  <Route path="/sell/product/subscription" element={<SellLayout currentStep={5}><SellProductSubscription /></SellLayout>} />
                  <Route path="/sell/product/basic" element={<SellLayout currentStep={6}><SellProductBasic /></SellLayout>} />
                  <Route path="/sell/product/private" element={<SellLayout currentStep={6}><SellProductPrivate /></SellLayout>} />
                  <Route path="/sell/service" element={<SellLayout currentStep={3}><SellService /></SellLayout>} />
                  <Route path="/sell/service/type" element={<SellLayout currentStep={4}><SellServiceType /></SellLayout>} />
                  <Route path="/sell/service/basic" element={<SellLayout currentStep={5}><SellServiceBasic /></SellLayout>} />
                  <Route path="/sell/service/private" element={<SellLayout currentStep={5}><SellServicePrivate /></SellLayout>} />
                  
                  <Route path="/service/:id" element={<Service />} />
                  <Route path="/service/:id/order" element={<ServiceOrder />} />
                </Routes>
              </BrowserRouter>
            </SidebarProvider>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
