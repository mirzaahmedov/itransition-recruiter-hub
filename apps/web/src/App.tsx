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
import AuthOauthCallbackPage from "./app/auth/AuthProviderSuccess";
import { RouteGuard } from "./app/RouteGuard";
import { UserRole } from "@rh/database/browser";
import axios from "axios";
import CandidatesPage from "./app/candidates/CandidatesPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;

          if (status === 401 || status === 403) {
            return false;
          }
        }

        return failureCount < 3;
      },
    },
  },
});

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
        path: "oauth/callback",
        element: <AuthOauthCallbackPage />,
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
            element: (
              <RouteGuard roles={[UserRole.ADMINISTRATOR]}>
                <UsersPage />
              </RouteGuard>
            ),
          },
          {
            path: "/candidates",
            element: (
              <RouteGuard roles={[UserRole.ADMINISTRATOR, UserRole.RECRUITER]}>
                <CandidatesPage />
              </RouteGuard>
            ),
          },
          {
            path: "/users/:id/profile",
            element: (
              <RouteGuard
                roles={[UserRole.ADMINISTRATOR, UserRole.CANDIDATE, UserRole.RECRUITER]}
                canView={({ user, params }) => (user.role === UserRole.CANDIDATE && user.id !== params.id ? false : true)}
              >
                <UserProfilePage />
              </RouteGuard>
            ),
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
            element: (
              <RouteGuard roles={[UserRole.RECRUITER, UserRole.ADMINISTRATOR]}>
                <AttributesPage />
              </RouteGuard>
            ),
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
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
