import { useAuthStore } from "@/store/useAuthStore";
import { SignOutIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";

export const AppHeader = () => {
  const logOut = useAuthStore((store) => store.logOut);
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut();
    navigate("/sign-in");
    localStorage.removeItem("accessToken");
  };

  return (
    <header className="w-full border-b px-2 py-2 flex justify-between">
      <SidebarTrigger />

      <Button size="icon" variant="ghost" onClick={handleLogOut}>
        <SignOutIcon className="icon" />
      </Button>
    </header>
  );
};
