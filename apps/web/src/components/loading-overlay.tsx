import { type FC, type HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { Spinner } from "./ui/spinner";

export const LoadingOverlay: FC<
  HTMLAttributes<HTMLDivElement> & {
    loading: boolean;
  }
> = ({ children, className, loading, ...props }) => {
  return (
    <div {...props} className={twMerge("relative", className)}>
      {children}
      {loading ? (
        <div className="absolute inset-0 grid place-items-center z-10 bg-black/40">
          <Spinner />
        </div>
      ) : null}
    </div>
  );
};
