import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "./ui/sidebar";

export const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="w-full flex h-full">
        <AppSidebar />
        <div className="flex-1 h-full flex flex-col bg-base-100">
          <AppHeader />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
