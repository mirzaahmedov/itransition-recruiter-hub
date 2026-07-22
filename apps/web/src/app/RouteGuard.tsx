import { useAuthStore } from "@/store/useAuthStore";
import type { User, UserRole } from "@rh/database/browser";
import type { FC, ReactNode } from "react";
import { ForbiddenPage } from "./forbidden/ForbiddenPage";
import { useParams } from "react-router-dom";

export const RouteGuard: FC<{
  roles: UserRole[];
  canView?: ({ user, params }: { user: User; params: Record<string, any> }) => boolean;
  children: ReactNode;
}> = ({ roles, children, canView }) => {
  const user = useAuthStore((store) => store.user);
  const params = useParams();

  if (
    !user ||
    !roles.includes(user.role) ||
    (typeof canView === "function" &&
      !canView({
        user,
        params,
      }))
  ) {
    return <ForbiddenPage />;
  }

  return children;
};
