import { ROUTES } from "@/common/constant/routes";

import { AppShell } from "../_components/app-page-meta";

const breadcrumbs = [{ text: "Dashboard", url: ROUTES.PROTECTED.DASHBOARD }];

export default function Page() {
  return (
    <AppShell
      breadcrumbs={breadcrumbs}
      description="Track activity and review the latest updates from your workspace."
      title="Dashboard"
    >
      <p>Dashboard</p>
    </AppShell>
  );
}
