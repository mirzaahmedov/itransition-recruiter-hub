import { Outlet } from "react-router-dom";
import { AppHeader } from "./app-header";

export const AppLayout = () => {
  return (
    <div className="min-h-full flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
