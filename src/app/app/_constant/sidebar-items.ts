import { Home, Wallet, SquareChartGantt, Zap, NotebookPen } from "lucide-react";
import { ROUTES } from "@/common/constant/routes";
import type { AppSidebarSection } from "../_components/app-sidebar";

export const APP_NAV_SECTIONS: AppSidebarSection[] = [
  {
    label: "General",
    items: [
      {
        title: "Dashboard",
        path: ROUTES.PROTECTED.DASHBOARD,
        icon: Home,
      },
    ],
  },
  {
    label: "Trading",
    items: [
      {
        title: "Account",
        path: "/app/capital",
        icon: Wallet,
      },
      {
        title: "Strategies",
        path: "/app/vaults",
        icon: SquareChartGantt,
      },
      {
        title: "Demon Hunter",
        path: "/app/reports",
        icon: Zap,
      },
      {
        title: "Reflection Journal",
        path: "/app/earn",
        icon: NotebookPen,
      },
    ],
  },
];
