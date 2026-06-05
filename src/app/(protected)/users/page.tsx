import { ROUTES } from "@/common/constant/routes";
import { AppShell } from "../_components/app-meta";

const breadcrumbs = [
  { text: "Dashboard", url: ROUTES.PROTECTED.DASHBOARD },
  { text: "Users", url: ROUTES.PROTECTED.USERS },
];

export default function Page() {
  return (
    <AppShell
      breadcrumbs={breadcrumbs}
      description="Manage people, permissions, and user activity in one place."
      title="Users"
    >
      <div>UsersPage</div>
    </AppShell>
  );
}
