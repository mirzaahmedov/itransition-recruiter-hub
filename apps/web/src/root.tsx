import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppRoot from "./app/app-root";
import AuthRedirect from "./app/auth/auth-redirect";
import UsersPage from "./app/users/users-page";
import PositionsPage from "./app/positions/positions-page";
import PositionPage from "./app/positions/position-page";
import PositionCreatePage from "./app/positions/position-create-page";
import UserProfilePage from "./app/users/profile/profile-page";
import ResumesPage from "./app/resumes/resumes-page";
import ResumePage from "./app/resumes/resume-page";
import RegisterPage from "./app/auth/register/register-page";
import LoginPage from "./app/auth/login/login-page";
import AuthOauthCallbackPage from "./app/auth/auth-provider-success";
import axios from "axios";
import CandidatesPage from "./app/users/candidates/candidates-page";
import NotFoundPage from "./app/not-found/not-found-page";
import AttributesPage from "./app/attributes/attributes-page";
import HomePage from "./app/home/home-page";
import LikedResumesPage from "./app/users/likes/liked-resumes-page";

import { AppLayout } from "./components/app-layout";
import { AuthFormLayout } from "./app/auth/auth-form-layout";
import { RouteGuard } from "./app/route-guard";
import { UserRole } from "@rh/database/browser";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchInterval: Infinity,
      refetchOnWindowFocus: false,
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
    path: "home",
    element: <HomePage />,
  },
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
            path: "/liked-resumes",
            element: <LikedResumesPage />,
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
