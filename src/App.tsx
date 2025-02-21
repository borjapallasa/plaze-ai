
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Product from "./pages/Product";
import Expert from "./pages/Expert";
import Experts from "./pages/Experts";
import Community from "./pages/Community";
import SignUp from "./pages/sign-up";
import SignUpCommunity from "./pages/sign-up-community";
import SignIn from "./pages/sign-in";
import SignInCommunity from "./pages/sign-in-community";
import Classroom from "./pages/Classroom";
import Jobs from "./pages/Jobs";
import ManageSubscriptions from "./pages/ManageSubscriptions";
import Blog from "./pages/Blog";
import Affiliates from "./pages/Affiliates";
import PersonalArea from "./pages/PersonalArea";
import Transactions from "./pages/Transactions";
import { Footer } from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product" element={<Product />} />
          <Route path="/expert" element={<Expert />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/community" element={<Community />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up/community" element={<SignUpCommunity />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-in/community" element={<SignInCommunity />} />
          <Route path="/community/classroom" element={<Classroom />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/manage-subscriptions" element={<ManageSubscriptions />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/affiliates" element={<Affiliates />} />
          <Route path="/personal-area" element={<PersonalArea />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
        <Footer />
      </div>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
