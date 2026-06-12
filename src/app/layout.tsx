import { Outlet } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function MainLayout() {
  return (
    <TooltipProvider>
      <Outlet />
    </TooltipProvider>
  );
}
