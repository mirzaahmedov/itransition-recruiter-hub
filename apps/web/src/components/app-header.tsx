import { createSupportTicket } from "@/app/support-ticket/api";
import { LikesResumesPopover } from "@/app/users/likes/liked-resumes-popover";
import { SupportTicketDialog } from "@/components/support-ticket-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetDescription, SheetHeader, SheetPanel, SheetPopup, SheetTitle } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { parseApiErrorMessage } from "@/lib/api/error";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { useThemeStore } from "@/store/use-theme-store";
import { fallbackName } from "@/utils/fallbackName";
import { Can } from "@casl/react";
import { ListIcon, MoonIcon, QuestionIcon, ReadCvLogoIcon, SignOutIcon, SunIcon } from "@phosphor-icons/react";
import { UserRole } from "@rh/database/browser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router-dom";

interface NavLinkItem {
  to: string;
  label: string;
  roles: UserRole[];
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn("text-sm transition-colors", isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground");

export const AppHeader = () => {
  const user = useAuthStore((store) => store.user);
  const logOut = useAuthStore((store) => store.logOut);
  const theme = useThemeStore((store) => store.theme);
  const toggleTheme = useThemeStore((store) => store.toggleTheme);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("max-md");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);

  const supportMutation = useMutation({
    mutationFn: createSupportTicket,
  });

  const handleSupportSubmit = (values: { title: string; link: string; priority: string }) => {
    supportMutation.mutate(
      { ...values, priority: values.priority as "HIGH" | "AVERAGE" | "LOW" },
      {
        onSuccess: () => {
          toast.success("Support ticket created");
          setSupportDialogOpen(false);
        },
        onError: (res) => {
          const message = parseApiErrorMessage(res);
          toast.error(message ?? "Failed to create support ticket");
        },
      },
    );
  };

  const handleLogOut = () => {
    logOut();
    localStorage.removeItem("accessToken");
    navigate("/auth/login");
    queryClient.clear();
  };

  const userInitials = fallbackName(user?.name ?? "U");

  const navLinks: NavLinkItem[] = useMemo(
    () =>
      user
        ? [
            { to: "/positions", label: "Positions", roles: [UserRole.ADMINISTRATOR, UserRole.RECRUITER, UserRole.CANDIDATE] },
            { to: "/resumes", label: "Resumes", roles: [UserRole.ADMINISTRATOR, UserRole.CANDIDATE, UserRole.RECRUITER] },
            { to: "/users", label: "Users", roles: [UserRole.ADMINISTRATOR] },
            { to: "/candidates", label: "Candidates", roles: [UserRole.ADMINISTRATOR, UserRole.RECRUITER] },
            { to: `/users/${user.id}/profile`, label: "Profile", roles: [UserRole.CANDIDATE] },
            { to: "/attributes", label: "Attributes", roles: [UserRole.ADMINISTRATOR, UserRole.RECRUITER] },
          ].filter((link) => link.roles.includes(user.role))
        : [],
    [user],
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-8 shrink-0 bg-brand text-white rounded-xl grid place-items-center">
              <ReadCvLogoIcon className="icon" />
            </span>
            <span className="font-bold text-sm hidden sm:block">RecruiterHub</span>
          </Link>

          {!isMobile && (
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Can I="read" a="Like">
            <LikesResumesPopover />
          </Can>

          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={toggleTheme} title="Toggle theme">
              {theme === "dark" ? <MoonIcon className="icon-md" /> : <SunIcon className="icon-md" />}
            </Button>

            <Button size="icon" variant="ghost" onClick={() => setSupportDialogOpen(true)} title="Support">
              <QuestionIcon className="icon-md" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={user?.avatar ?? undefined} alt={user?.name ?? "Avatar"} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              {!isMobile && <span className="text-sm font-medium max-w-30 truncate">{user?.name ?? "User"}</span>}
            </div>
          </div>

          <Button size="icon" variant="ghost" onClick={handleLogOut} title="Sign out">
            <SignOutIcon className="icon-md" />
          </Button>

          {isMobile && (
            <Button size="icon" variant="ghost" onClick={() => setMobileMenuOpen(true)}>
              <ListIcon className="icon-md" />
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
              {navLinks.map((link) => (
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

      <SupportTicketDialog
        open={supportDialogOpen}
        onOpenChange={setSupportDialogOpen}
        onSubmit={handleSupportSubmit}
        isSubmitting={supportMutation.isPending}
      />
    </header>
  );
};
