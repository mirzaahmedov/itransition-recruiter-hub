import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import AppRoot from "./app/AppRoot";
import { AttributesPage } from "./app/attributes/AttributesPage";
import AuthSuccessPage from "./app/auth-success/AuthSuccessPage";
import { NotFoundPage } from "./app/not-found/NotFoundPage";
import AuthPage from "./app/auth/AuthPage";
import UsersPage from "./app/users/UsersPage";
import { AppLayout } from "./components/AppLayout";
import PositionsPage from "./app/positions/PositionsPage";
import PositionPage from "./app/positions/PositionPage";
import PositionCreatePage from "./app/positions/PositionCreatePage";
import UserProfilePage from "./app/users/profile/UserProfilePage";
import ResumesPage from "./app/resumes/ResumesPage";
import ResumePage from "./app/resumes/ResumePage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/auth-success",
    element: <AuthSuccessPage />,
  },
  {
    element: <AppRoot />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to="/positions" replace />,
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
