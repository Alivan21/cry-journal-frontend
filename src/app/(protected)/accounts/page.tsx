import { MonitorCheck } from "lucide-react";
import { ROUTES } from "@/common/constant/routes";
import { AppShell } from "../_components/app-meta";
import { AccountGroupCard } from "./_components/account-card";

const breadcrumbs = [
  { text: "Dashboard", url: ROUTES.PROTECTED.DASHBOARD },
  { text: "Accounts Group", url: ROUTES.PROTECTED.ACCOUNTS.INDEX },
];

export default function Page() {
  return (
    <AppShell
      breadcrumbs={breadcrumbs}
      description="Organize the accounts powering your trade and stock operations."
      title="Accounts Groups"
    >
      <section className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <AccountGroupCard
            accountLength={10}
            description={`Description of Account Group ${index + 1}`}
            icon={MonitorCheck}
            key={index}
            name={`Account Group ${index + 1}`}
          />
        ))}
      </section>
    </AppShell>
  );
}
