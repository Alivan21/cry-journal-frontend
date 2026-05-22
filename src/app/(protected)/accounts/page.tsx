import { ROUTES } from "@/common/constant/routes";
import { AppShell } from "../_components/app-page-meta";

const breadcrumbs = [
  { text: "Dashboard", url: ROUTES.PROTECTED.DASHBOARD },
  { text: "Accounts", url: ROUTES.PROTECTED.ACCOUNTS.INDEX },
];

export default function Page() {
  return (
    <AppShell breadcrumbs={breadcrumbs} title="Accounts">
      <div>Page</div>
    </AppShell>
  );
}
