import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetHeader, SheetPopup, SheetTitle, SheetDescription, SheetPanel } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { fallbackName } from "@/utils/fallbackName";
import { ListIcon, ReadCvLogoIcon, SignOutIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { to: "/positions", label: "Positions" },
  { to: "/resumes", label: "Resumes" },
  { to: "/users", label: "Users" },
  { to: "/profile", label: "Profile" },
  { to: "/attributes", label: "Attributes" },
] as const;

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition-colors ${isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`;

export const AppHeader = () => {
  const user = useAuthStore((store) => store.user);
  const logOut = useAuthStore((store) => store.logOut);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("max-md");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogOut = () => {
    logOut();
    localStorage.removeItem("accessToken");
    navigate("/auth/login");
  };

  const userInitials = fallbackName(user?.name ?? "U");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/positions" className="flex items-center gap-2">
            <span className="size-8 shrink-0 bg-brand text-white rounded-xl grid place-items-center">
              <ReadCvLogoIcon className="icon" />
            </span>
            <span className="font-bold text-sm hidden sm:block">RecruiterHub</span>
          </Link>

          {!isMobile && (
            <nav className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={user?.avatar ?? undefined} alt={user?.name ?? "Avatar"} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            {!isMobile && (
              <span className="text-sm font-medium max-w-[120px] truncate">{user?.name ?? "User"}</span>
            )}
          </div>

          <Button size="icon" variant="ghost" onClick={handleLogOut} title="Sign out">
            <SignOutIcon className="icon" />
          </Button>

          {isMobile && (
            <Button size="icon" variant="ghost" onClick={() => setMobileMenuOpen(true)}>
              <ListIcon className="icon" />
            </Button>
          )}
        </div>
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetPopup side="right">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Browse the application</SheetDescription>
          </SheetHeader>
          <SheetPanel>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </SheetPanel>
        </SheetPopup>
      </Sheet>
    </header>
  );
};
