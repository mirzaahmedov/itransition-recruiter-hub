import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { fetchUserProfile } from "./api";
import { Spinner } from "@/components/ui/spinner";

const AppRoot = () => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const setUserProfile = useAuthStore((store) => store.setUserProfile);
  const logout = useAuthStore((store) => store.logOut);

  const navigate = useNavigate();

  const fetchUserProfileMutation = useMutation({
    mutationKey: ["users/me"],
    mutationFn: fetchUserProfile,
  });

  useEffect(() => {
    const handleError = () => {
      logout();
      navigate("/sign-in");
    };
    fetchUserProfileMutation.mutate(undefined, {
      onSuccess(res) {
        if (res.success) {
          setUserProfile(res.data);
        } else {
          handleError();
        }
      },
      onError() {
        handleError();
      },
    });
  }, [setUserProfile]);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <div className="h-full grid place-content-center">
      <Spinner size={40} />
    </div>
  );
};

export default AppRoot;
