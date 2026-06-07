import { Archive, Plus, Wallet } from "lucide-react";
import { useNavigate } from "react-router";

import type { AccountItem } from "@/api/accounts/type";
import { ROUTES } from "@/common/constant/routes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAccountArchiveActions } from "../_hooks/use-account-archive-actions";
import { AccountCard } from "./account-card";

type AccountGroupAccountsSectionProps = {
  groupId: string;
  activeAccounts: AccountItem[];
  archivedAccounts: AccountItem[];
};

function AccountGroupAccountsSection({
  groupId,
  activeAccounts,
  archivedAccounts,
}: AccountGroupAccountsSectionProps) {
  const navigate = useNavigate();
  const { archiveAccount, restoreAccount, pendingAccountId, isPending } =
    useAccountArchiveActions();

  const handleManageAccounts = () => {
    void navigate(ROUTES.PROTECTED.ACCOUNTS.EDIT(groupId));
  };

  const handleEditAccount = (accountId: string) => {
    void navigate(ROUTES.PROTECTED.ACCOUNTS.EDIT_ACCOUNT(groupId, accountId));
  };

  return (
    <section className="space-y-4">
      <div className="space-y-0">
        <h2 className="font-heading text-foreground text-lg font-semibold tracking-tight">
          Accounts
        </h2>
        <p className="text-muted-foreground text-sm">
          Browse accounts in this group and manage their archive status.
        </p>
      </div>

      <Tabs defaultValue="active">
        <TabsList aria-label="Account status" className="w-10 sm:w-auto">
          <TabsTrigger value="active">
            Active
            <Badge className="rounded-full font-normal" variant="outline">
              {activeAccounts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived
            <Badge className="rounded-full font-normal" variant="outline">
              {archivedAccounts.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeAccounts.length === 0 ? (
            <EmptyState
              action={
                <Button onClick={handleManageAccounts} size="sm">
                  <Plus className="size-4" />
                  Add account
                </Button>
              }
              className="h-[280px] max-h-[280px]"
              description="This group does not have any active accounts yet."
              eyebrow="No active accounts"
              icon={Wallet}
              title="Add your first account"
            />
          ) : (
            <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(236px,1fr))] gap-4">
              {activeAccounts.map((account) => (
                <AccountCard
                  account={account}
                  archived={false}
                  disabled={isPending && pendingAccountId === account.id}
                  key={account.id}
                  onArchive={archiveAccount}
                  onEdit={handleEditAccount}
                  onRestore={restoreAccount}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived">
          {archivedAccounts.length === 0 ? (
            <EmptyState
              className="h-[280px] max-h-[280px]"
              description="Archived accounts will appear here when you archive them from the active list."
              eyebrow="No archived accounts"
              icon={Archive}
              title="No archived accounts in this group"
            />
          ) : (
            <div className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(236px,1fr))] gap-4">
              {archivedAccounts.map((account) => (
                <AccountCard
                  account={account}
                  archived
                  disabled={isPending && pendingAccountId === account.id}
                  key={account.id}
                  onArchive={archiveAccount}
                  onEdit={handleEditAccount}
                  onRestore={restoreAccount}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}

export { AccountGroupAccountsSection, type AccountGroupAccountsSectionProps };
