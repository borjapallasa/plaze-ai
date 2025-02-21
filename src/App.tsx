
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Product from "./pages/Product";
import Expert from "./pages/Expert";
import Community from "./pages/Community";
import SignUp from "./pages/sign-up";
import SignUpCommunity from "./pages/sign-up-community";
import SignIn from "./pages/sign-in";
import Classroom from "./pages/Classroom";
import Jobs from "./pages/Jobs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product" element={<Product />} />
        <Route path="/expert" element={<Expert />} />
        <Route path="/community" element={<Community />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-up/community" element={<SignUpCommunity />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/classroom" element={<Classroom />} />
        <Route path="/jobs" element={<Jobs />} />
      </Routes>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
