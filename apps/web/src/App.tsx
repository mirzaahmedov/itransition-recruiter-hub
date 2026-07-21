import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppRoot from "./app/AppRoot";
import { AttributesPage } from "./app/attributes/AttributesPage";
import AuthRedirect from "./app/auth/AuthRedirect";
import { NotFoundPage } from "./app/not-found/NotFoundPage";
import UsersPage from "./app/users/UsersPage";
import { AppLayout } from "./components/AppLayout";
import PositionsPage from "./app/positions/PositionsPage";
import PositionPage from "./app/positions/PositionPage";
import PositionCreatePage from "./app/positions/PositionCreatePage";
import UserProfilePage from "./app/users/profile/ProfilePage";
import ResumesPage from "./app/resumes/ResumesPage";
import ResumePage from "./app/resumes/ResumePage";
import { AuthFormLayout } from "./app/auth/AuthFormLayout";
import RegisterPage from "./app/auth/register/RegisterPage";
import LoginPage from "./app/auth/login/LoginPage";
import AuthProviderSuccessPage from "./app/auth/AuthProviderSuccess";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "auth",
    children: [
      {
        element: <AuthFormLayout />,
        children: [
          {
            path: "register",
            element: <RegisterPage />,
          },
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
      {
        path: "verify-email",
        element: <AuthRedirect />,
      },
      {
        path: "verify-email/success",
        element: <AuthRedirect />,
      },
      {
        path: "google/success",
        element: <AuthProviderSuccessPage />,
      },
    ],
  },
  {
    element: <AppRoot />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <AuthRedirect />,
          },
          {
            path: "/users",
            element: <UsersPage />,
          },
          {
            path: "/users/:id/profile",
            element: <UserProfilePage />,
          },
          {
            path: "/positions",
            element: <PositionsPage />,
          },
          {
            path: "/positions/new",
            element: <PositionCreatePage />,
          },
          {
            path: "/positions/:id",
            element: <PositionPage />,
          },
          {
            path: "/attributes",
            element: <AttributesPage />,
          },
          {
            path: "/resumes",
            element: <ResumesPage />,
          },
          {
            path: "/resumes/:id",
            element: <ResumePage />,
          },
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}

export default App;
