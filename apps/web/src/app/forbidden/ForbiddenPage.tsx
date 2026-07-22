import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ShieldWarningIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export const ForbiddenPage = () => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldWarningIcon size={56} weight="duotone" />
          </div>
        </div>

        <p className="text-6xl font-black">403</p>

        <h1 className="mt-4 text-3xl font-bold">Forbidden page</h1>

        <p className="mt-3 text-muted-foreground max-w-md mx-auto">You don't have access to this page</p>

        <div className="mt-8 flex justify-center gap-3">
          <Link to="/positions">
            <Button>Go Home</Button>
          </Link>
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeftIcon className="size-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};
