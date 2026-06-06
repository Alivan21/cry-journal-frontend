import { FolderPlus, MonitorCheck, Plus } from "lucide-react";
import { Suspense } from "react";
import { useNavigate } from "react-router";

import { accountQueries } from "@/api/accounts/query";
import { ROUTES } from "@/common/constant/routes";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useSuspenseQuery } from "@/hooks/request/use-suspense-query";

import { AppShell } from "../_components/app-shell";
import { AccountGroupCard } from "./_components/account-card";

const breadcrumbs = [
  { text: "Dashboard", url: ROUTES.PROTECTED.DASHBOARD },
  { text: "Accounts Group", url: ROUTES.PROTECTED.ACCOUNTS.INDEX },
];

type AccountGroupsListProps = {
  onCreateAccountGroup: () => void;
};

function AccountGroupsList({ onCreateAccountGroup }: AccountGroupsListProps) {
  const { data } = useSuspenseQuery(accountQueries.getAccountGroupsQuery());

  if (data.data.length === 0) {
    return (
      <EmptyState
        action={
          <Button onClick={onCreateAccountGroup}>
            <Plus /> Create your first group
          </Button>
        }
        description="Create a group to collect related brokerage, crypto, or savings accounts before you start tracking positions and activity."
        eyebrow="No groups yet"
        icon={FolderPlus}
        title="Start with a clean account group"
      />
    );
  }

  return (
    <section className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(236px,1fr))] gap-4">
      {data.data.map((accountGroup) => (
        <AccountGroupCard
          description={accountGroup.description}
          icon={MonitorCheck}
          key={accountGroup.id}
          name={accountGroup.name}
        />
      ))}
    </section>
  );
}

type TopActionsProps = {
  onCreateAccountGroup: () => void;
};

function TopActions({ onCreateAccountGroup }: TopActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={onCreateAccountGroup} size="sm">
        <Plus /> Add Group
      </Button>
    </div>
  );
}

export default function Page() {
  const navigate = useNavigate();

  const goToCreateAccountGroup = () => {
    void navigate(ROUTES.PROTECTED.ACCOUNTS.CREATE);
  };

  return (
    <AppShell
      breadcrumbs={breadcrumbs}
      description="Organize the accounts powering your trade and stock operations."
      title="Accounts Groups"
      topActions={<TopActions onCreateAccountGroup={goToCreateAccountGroup} />}
    >
      <Suspense
        fallback={<LoadingState count={8} title="Loading account groups" variant="card-grid" />}
      >
        <AccountGroupsList onCreateAccountGroup={goToCreateAccountGroup} />
      </Suspense>
    </AppShell>
  );
}
