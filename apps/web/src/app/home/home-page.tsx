import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/use-auth-store";
import { fallbackName } from "@/utils/fallbackName";
import { ArrowRightIcon, BriefcaseIcon, FilesIcon, ReadCvLogoIcon, SignOutIcon, UsersThreeIcon } from "@phosphor-icons/react";
import { type Position } from "@rh/database/browser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchDashboardStats, fetchLatestPositions, fetchPopularPositions } from "./api";
import { Skeleton } from "@/components/ui/skeleton";

const statsOptions = [
  { key: "resume", label: "Resumes Created", icon: FilesIcon },
  { key: "activePosition", label: "Open Positions", icon: BriefcaseIcon },
  { key: "candidate", label: "Candidates Registered", icon: UsersThreeIcon },
];

const PositionCard = ({ position }: { position: Position }) => (
  <Link
    to={`/positions/${position.id}`}
    className="group block rounded-2xl border bg-card p-5 transition-all hover:shadow-md hover:border-foreground/15"
  >
    <div className="flex items-start justify-between gap-3">
      <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors">{position.title}</h3>
      <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-brand transition-colors mt-0.5" />
    </div>
    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{position.description}</p>
  </Link>
);

const HomePage = () => {
  const user = useAuthStore((store) => store.user);
  const queryClient = useQueryClient();
  const logOut = useAuthStore((store) => store.logOut);
  const userInitials = fallbackName(user?.name ?? "U");

  const handleLogOut = () => {
    logOut();
    localStorage.removeItem("accessToken");
    queryClient.clear();
  };

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboard/stats"],
    queryFn: fetchDashboardStats,
  });
  const statsData = stats?.data ?? {
    resume: 0,
    activePosition: 0,
    candidate: 0,
  };

  const { data: latestPositions, isLoading: isLoadingLatestPositions } = useQuery({
    queryKey: ["dashboard/positions/latest"],
    queryFn: fetchLatestPositions,
  });
  const latestPositionsData = latestPositions?.data ?? [];

  const { data: popularPositions, isLoading: isLoadingPopularPositions } = useQuery({
    queryKey: ["dashboard/positions/popular"],
    queryFn: fetchPopularPositions,
  });
  const popularPositionsData = popularPositions?.data ?? [];

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/home" className="flex items-center gap-2">
            <span className="size-8 shrink-0 bg-brand text-white rounded-xl grid place-items-center">
              <ReadCvLogoIcon className="icon" />
            </span>
            <span className="font-bold text-sm">RecruiterHub</span>
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/auth/redirect">
                <Avatar className="size-8">
                  <AvatarImage src={user?.avatar ?? undefined} alt={user?.name ?? "Avatar"} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Link>
              <Button size="icon" variant="ghost" onClick={handleLogOut} title="Sign out">
                <SignOutIcon className="icon" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" render={<Link to="/auth/login" />}>
                Sign in
              </Button>
              <Button size="sm" render={<Link to="/auth/register" />}>
                Get started
              </Button>
            </div>
          )}
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-brand/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 text-center">
          <Badge variant="info" size="lg" className="mb-6">
            Hiring made simple
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find the right people
            <br />
            for every role
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            RecruiterHub helps you manage positions, collect resumes, and connect with candidates — all in one place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" render={<Link to="/auth/register" />}>
              Create an account
            </Button>
            <Button variant="outline" size="lg" render={<Link to="/auth/login" />}>
              Sign in
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {isLoadingStats
            ? statsOptions.map((_, index) => <Skeleton key={index} className="h-24 rounded-2xl" />)
            : statsOptions.map(({ key, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-4 rounded-2xl border bg-card p-6">
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="icon-md" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{statsData[key as keyof typeof statsData].toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Latest Positions</h2>
            <p className="text-sm text-muted-foreground mt-1">See what roles are open right now</p>
          </div>
          <Button variant="ghost" size="sm" render={<Link to="/positions" />}>
            View all <ArrowRightIcon className="icon" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoadingLatestPositions
            ? Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-2xl" />)
            : latestPositionsData.map((position) => <PositionCard key={position.id} position={position} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Popular Positions</h2>
            <p className="text-sm text-muted-foreground mt-1">See what roles are trending right now</p>
          </div>
          <Button variant="ghost" size="sm" render={<Link to="/positions" />}>
            View all <ArrowRightIcon className="icon" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoadingPopularPositions
            ? Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-2xl" />)
            : popularPositionsData.map((position) => <PositionCard key={position.id} position={position} />)}
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} RecruiterHub. All rights reserved.</span>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/positions" className="hover:text-foreground transition-colors">
              Positions
            </Link>
            <Link to="/auth/login" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
