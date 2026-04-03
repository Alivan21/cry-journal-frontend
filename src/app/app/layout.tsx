import { Outlet } from "react-router";
import { AppContainer } from "./_components/app-container";

export default function AppLayout() {
  return (
    <AppContainer>
      <Outlet />
    </AppContainer>
  );
}
