import { WarningCircleIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <WarningCircleIcon size={56} weight="duotone" />
          </div>
        </div>

        <p className="text-6xl font-black">404</p>

        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>

        <p className="mt-3 text-muted-foreground max-w-md mx-auto">
          The page you're looking for doesn't exist, may have been moved, or the URL might be incorrect.
        </p>

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
