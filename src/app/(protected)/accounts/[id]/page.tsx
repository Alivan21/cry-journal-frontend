import { Pencil } from "lucide-react";
import { Suspense } from "react";
import { useNavigate, useParams } from "react-router";

import { accountGroupQueries } from "@/api/account-groups/query";
import { accountQueries } from "@/api/accounts/query";
import NotFoundPage from "@/app/404";
import { ROUTES } from "@/common/constant/routes";
import { Button } from "@/components/ui/button";
import { useSuspenseQuery } from "@/hooks/request/use-suspense-query";

import { AppShell } from "../../_components/app-shell";
import { AccountGroupAccountsSection } from "./_components/account-group-accounts-section";
import { AccountGroupDetailSummary } from "./_components/account-group-detail-summary";
import AccountGroupDetailLoading from "./loading";

type AccountGroupDetailProps = {
  id: string;
};

function AccountGroupDetail({ id }: AccountGroupDetailProps) {
  const navigate = useNavigate();
  const { data: groupData } = useSuspenseQuery(accountGroupQueries.getAccountGroupQuery(id));
  const { data: activeAccountsData } = useSuspenseQuery(accountQueries.getAccountsQuery(id, false));
  const { data: archivedAccountsData } = useSuspenseQuery(
    accountQueries.getAccountsQuery(id, true)
  );

  const group = groupData.data;

  const breadcrumbs = [
    { text: "Dashboard", url: ROUTES.PROTECTED.DASHBOARD },
    { text: "Accounts Group", url: ROUTES.PROTECTED.ACCOUNTS.INDEX },
    { text: group.name, url: ROUTES.PROTECTED.ACCOUNTS.DETAIL(id) },
  ];

  const handleManageAccounts = () => {
    void navigate(ROUTES.PROTECTED.ACCOUNTS.EDIT(id));
  };

  return (
    <AppShell
      backTo={ROUTES.PROTECTED.ACCOUNTS.INDEX}
      breadcrumbs={breadcrumbs}
      description="View and manage the accounts in this group."
      title="Detail Account Group"
      topActions={
        <Button onClick={handleManageAccounts} size="sm">
          <Pencil className="size-4" />
          Manage account group
        </Button>
      }
    >
      <div className="space-y-6">
        <AccountGroupDetailSummary group={group} />
        <AccountGroupAccountsSection
          activeAccounts={activeAccountsData.data}
          archivedAccounts={archivedAccountsData.data}
          groupId={id}
        />
      </div>
    </AppShell>
  );
}

export default function Page() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <NotFoundPage />;
  }

  return (
    <Suspense fallback={<AccountGroupDetailLoading />}>
      <AccountGroupDetail id={id} />
    </Suspense>
  );
}
