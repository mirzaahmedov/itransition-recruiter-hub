import { UserRole } from "@rh/database/browser";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthSuccessPage = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const accessToken = searchParams.get("accessToken");
  const userRole = searchParams.get("userRole") as UserRole;

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      navigate("/users");
    } else {
      navigate("/sign-in");
      localStorage.removeItem("accessToken");
    }
  }, [navigate, accessToken, userRole]);

  return (
    <div className="h-full grid place-content-center">
      <div className="loading loading-xl loading-spinner"></div>
    </div>
  );
};

export default AuthSuccessPage;
