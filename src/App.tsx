
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

// Import all pages
import Index from "./pages/Index";
import Product from "./pages/Product";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import SignInCommunity from "./pages/sign-in-community";
import SignUpCommunity from "./pages/sign-up-community";
import ThankYou from "./pages/ThankYou";
import RecoverPassword from "./pages/RecoverPassword";
import Blog from "./pages/Blog";
import Affiliates from "./pages/Affiliates";
import Jobs from "./pages/Jobs";
import Job from "./pages/Job";
import Experts from "./pages/Experts";
import Expert from "./pages/Expert";
import EditProduct from "./pages/EditProduct";
import Communities from "./pages/Communities";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/product/:id",
    element: <Product />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/sign-in-community",
    element: <SignInCommunity />,
  },
  {
    path: "/sign-up-community",
    element: <SignUpCommunity />,
  },
  {
    path: "/thank-you",
    element: <ThankYou />,
  },
  {
    path: "/recover-password",
    element: <RecoverPassword />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/affiliates",
    element: <Affiliates />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/job/:id",
    element: <Job />,
  },
  {
    path: "/experts",
    element: <Experts />,
  },
  {
    path: "/expert/:id",
    element: <Expert />,
  },
  {
    path: "/edit-product/:id",
    element: <EditProduct />,
  },
  {
    path: "/communities",
    element: <Communities />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
