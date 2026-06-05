import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { toast } from "sonner";
import { ROUTES } from "@/common/constant/routes";
import { AppContainer } from "./_components/app-container";

export default function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("auth:unauthorized", () => {
      toast.error("Your session expired please login again");
      void navigate(`${ROUTES.PUBLIC.LOGIN}`);
    });
    return () =>
      window.removeEventListener(
        "auth:unauthorized",
        () => void navigate(`${ROUTES.PUBLIC.LOGIN}`)
      );
  }, [navigate]);

  return (
    <AppContainer>
      <Outlet />
    </AppContainer>
  );
}
