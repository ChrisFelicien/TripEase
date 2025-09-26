import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import {
  DashboardPage,
  DestinationPage,
  HomePage,
  LoginPage,
  RegisterPage,
  ReservationPage,
  ErrorPage
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/dashboard",
    element: <DashboardPage />
  },
  {
    path: "/destination",
    element: <DestinationPage />
  },
  {
    path: "/reservation",
    element: <ReservationPage />
  },

  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <RegisterPage />
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
