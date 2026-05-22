import { Home, Wallet, SquareChartGantt, Zap, NotebookPen } from "lucide-react";
import { ROUTES } from "@/common/constant/routes";
import type { AppSidebarFooterLink, AppSidebarSection } from "../_components/type";

export const DEFAULT_BRAND_NAME = "Cry Journal";

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
        title: "Accounts",
        path: ROUTES.PROTECTED.ACCOUNTS.INDEX,
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

export const EMPTY_FOOTER_LINKS: AppSidebarFooterLink[] = [];
