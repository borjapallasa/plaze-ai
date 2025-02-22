
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/index";
import Product from "./pages/Product";
import EditProduct from "./pages/EditProduct";
import Expert from "./pages/Expert";
import Experts from "./pages/Experts";
import Job from "./pages/Job";
import Jobs from "./pages/Jobs";
import Blog from "./pages/Blog";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import SignInCommunity from "./pages/sign-in-community";
import SignUpCommunity from "./pages/sign-up-community";
import Affiliates from "./pages/Affiliates";
import Communities from "./pages/Communities";
import { Footer } from "./components/Footer";

const queryClient = new QueryClient();

// Create a root layout component that includes the footer
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {children}
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout><Index /></RootLayout>,
  },
  {
    path: "/product/:productId",
    element: <RootLayout><Product /></RootLayout>,
  },
  {
    path: "/edit-product/:productId",
    element: <RootLayout><EditProduct /></RootLayout>,
  },
  {
    path: "/expert/:expertId",
    element: <RootLayout><Expert /></RootLayout>,
  },
  {
    path: "/experts",
    element: <RootLayout><Experts /></RootLayout>,
  },
  {
    path: "/job/:jobId",
    element: <RootLayout><Job /></RootLayout>,
  },
  {
    path: "/jobs",
    element: <RootLayout><Jobs /></RootLayout>,
  },
  {
    path: "/blog",
    element: <RootLayout><Blog /></RootLayout>,
  },
  {
    path: "/sign-in",
    element: <RootLayout><SignIn /></RootLayout>,
  },
  {
    path: "/sign-up",
    element: <RootLayout><SignUp /></RootLayout>,
  },
  {
    path: "/sign-in-community",
    element: <RootLayout><SignInCommunity /></RootLayout>,
  },
  {
    path: "/sign-up-community",
    element: <RootLayout><SignUpCommunity /></RootLayout>,
  },
  {
    path: "/affiliates",
    element: <RootLayout><Affiliates /></RootLayout>,
  },
  {
    path: "/communities",
    element: <RootLayout><Communities /></RootLayout>,
  }
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
