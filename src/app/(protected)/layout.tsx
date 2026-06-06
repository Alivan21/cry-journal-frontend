import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { toast } from "sonner";
import { ROUTES } from "@/common/constant/routes";
import { AppContainer } from "./_components/app-container";

export default function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      toast.error("Your session expired please login again");
      void navigate(ROUTES.PUBLIC.LOGIN);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  return (
    <AppContainer>
      <Outlet />
    </AppContainer>
  );
}
