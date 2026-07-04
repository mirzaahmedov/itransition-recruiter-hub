import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppRoot from "./app/AppRoot";
import { AttributesPage } from "./app/attributes/AttributesPage";
import AuthSuccessPage from "./app/auth-success/AuthSuccessPage";
import { NotFoundPage } from "./app/not-found/NotFoundPage";
import SignInPage from "./app/sign-in/SignInPage";
import UsersPage from "./app/users/UsersPage";
import { AppLayout } from "./components/AppLayout";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInPage />,
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
            path: "/users",
            element: <UsersPage />,
          },
          {
            path: "/attributes",
            element: <AttributesPage />,
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
