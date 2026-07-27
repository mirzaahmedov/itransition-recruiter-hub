import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppRoot from "./app/app-root";
import AttributesPage from "./app/attributes/attributes-page";
import AuthOauthCallbackPage from "./app/auth/auth-oauth-callback";
import AuthRedirect from "./app/auth/auth-redirect";
import LoginPage from "./app/auth/login/login-page";
import RegisterPage from "./app/auth/register/register-page";
import HomePage from "./app/home/home-page";
import NotFoundPage from "./app/not-found/not-found-page";
import PositionCreatePage from "./app/positions/position-create-page";
import PositionPage from "./app/positions/position-page";
import PositionsPage from "./app/positions/positions-page";
import ResumePage from "./app/resumes/resume-page";
import ResumesPage from "./app/resumes/resumes-page";
import CandidatesPage from "./app/users/candidates/candidates-page";
import LikedResumesPage from "./app/users/likes/liked-resumes-page";
import UserProfilePage from "./app/users/profile/profile-page";
import UsersPage from "./app/users/users-page";

import { UserRole } from "@rh/database/browser";
import { AuthFormLayout } from "./app/auth/auth-form-layout";
import { RouteGuard } from "./app/route-guard";
import { AppLayout } from "./components/app-layout";

import { queryClient } from "./lib/api/queryClient";
import { useThemeStore } from "./store/use-theme-store";
import { useEffect } from "react";

const router = createBrowserRouter([
  {
    path: "/",
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
            path: "/auth/redirect",
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
  const theme = useThemeStore((store) => store.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
