import { useAuthStore } from "@/store/useAuthStore";
import { UserRole } from "@rh/database/browser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthRedirect = () => {
  const navigate = useNavigate();

  const user = useAuthStore((store) => store.user);

  useEffect(() => {
    if (user) {
      let redirectPath = `/users/${user.id}/profile`;

      switch (user.role) {
        case UserRole.ADMINISTRATOR:
          redirectPath = "/users";
          break;
        case UserRole.RECRUITER:
          redirectPath = "/positions";
          break;
      }

      navigate(redirectPath, { replace: true });
    } else {
      localStorage.removeItem("accessToken");
      navigate("/auth/login", { replace: true });
    }
  }, [navigate, user]);

  return (
    <div className="h-full grid place-content-center">
      <div className="loading loading-xl loading-spinner"></div>
    </div>
  );
};

export default AuthRedirect;
