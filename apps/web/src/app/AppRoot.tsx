import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { fetchMe } from "./api";
import { Spinner } from "@/components/ui/spinner";
import { fetchCategories } from "./categories/api";
import { useCategoryStore } from "@/store/useCategoryStore";
import { CaslProvider } from "./auth/CaslProvider";

const AppRoot = () => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const setUserProfile = useAuthStore((store) => store.setUserProfile);
  const setCategories = useCategoryStore((store) => store.setCategories);
  const logout = useAuthStore((store) => store.logOut);

  const navigate = useNavigate();

  const fetchMeMutation = useMutation({
    mutationKey: ["users/me"],
    mutationFn: fetchMe,
  });

  const fetchCategoryMutation = useMutation({
    mutationKey: ["categories"],
    mutationFn: fetchCategories,
  });

  useEffect(() => {
    const handleError = () => {
      logout();
      navigate("/auth/login");
    };
    fetchMeMutation.mutate(undefined, {
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

  useEffect(() => {
    fetchCategoryMutation.mutateAsync().then((res) => {
      setCategories(res.data ?? []);
    });
  }, []);

  return isAuthenticated ? (
    <CaslProvider>
      <Outlet />
    </CaslProvider>
  ) : (
    <div className="h-full grid place-content-center">
      <Spinner size={40} />
    </div>
  );
};

export default AppRoot;
