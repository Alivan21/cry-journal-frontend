import {
  ArrowLeftRight,
  CreditCard,
  FileText,
  Landmark,
  LayoutDashboard,
  Sparkles,
  Wallet,
} from "lucide-react";
import { ROUTES } from "@/common/constant/routes";
import type { AppSidebarSection } from "../_components/app-sidebar";

export const APP_NAV_SECTIONS: AppSidebarSection[] = [
  {
    label: "General",
    items: [
      {
        title: "Dashboard",
        path: ROUTES.PROTECTED.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        title: "Payment",
        path: "/app/payments",
        icon: Wallet,
      },
      {
        title: "Transaction",
        path: "/app/transactions",
        icon: ArrowLeftRight,
      },
      {
        title: "Cards",
        icon: CreditCard,
        children: [
          {
            title: "Virtual Cards adkjwakdjwakjdka",
            path: "/app/cards/virtual",
            icon: CreditCard,
          },
          {
            title: "Physical Cards",
            path: "/app/cards/physical",
            icon: CreditCard,
          },
        ],
      },
    ],
  },
  {
    label: "Support",
    items: [
      {
        title: "Capital",
        path: "/app/capital",
        icon: Landmark,
      },
      {
        title: "Vaults",
        path: "/app/vaults",
        icon: CreditCard,
      },
      {
        title: "Reports",
        path: "/app/reports",
        icon: FileText,
      },
      {
        title: "Earn",
        path: "/app/earn",
        icon: Sparkles,
        badge: "€160",
      },
    ],
  },
];
