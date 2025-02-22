import { RouterProvider, createBrowserRouter } from "react-router-dom";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/product/:productId",
    element: <Product />,
  },
  {
    path: "/edit-product/:productId",
    element: <EditProduct />,
  },
  {
    path: "/expert/:expertId",
    element: <Expert />,
  },
  {
    path: "/experts",
    element: <Experts />,
  },
  {
    path: "/job/:jobId",
    element: <Job />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/blog",
    element: <Blog />,
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
    path: "/affiliates",
    element: <Affiliates />,
  },
  {
    path: "/communities",
    element: <Communities />,
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
