import { WarningCircleIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <main className="hero min-h-screen bg-base-100">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <div className="mb-6 flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-error/10 text-error">
              <WarningCircleIcon size={56} weight="duotone" />
            </div>
          </div>

          <p className="text-6xl font-black text-base-content">404</p>

          <h1 className="mt-4 text-3xl font-bold">Page not found</h1>

          <p className="mt-3 text-base-content/70">The page you're looking for doesn't exist, may have been moved, or the URL might be incorrect.</p>

          <div className="mt-8 flex justify-center gap-3">
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>

            <button className="btn btn-ghost" onClick={() => window.history.back()}>
              <ArrowLeftIcon size={18} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
