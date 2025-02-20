
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import SignUp from './pages/sign-up.tsx';
import SignIn from './pages/sign-in.tsx';
import Classroom from './pages/Classroom.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/classroom",
    element: <Classroom />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
