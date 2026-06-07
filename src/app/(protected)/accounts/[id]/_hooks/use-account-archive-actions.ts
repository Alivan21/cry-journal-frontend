import { useState } from "react";
import { toast } from "sonner";

import { useArchiveAccountMutation, useRestoreAccountMutation } from "@/api/accounts/query";

function useAccountArchiveActions() {
  const [pendingAccountId, setPendingAccountId] = useState<string | null>(null);
  const archiveMutation = useArchiveAccountMutation();
  const restoreMutation = useRestoreAccountMutation();

  const archiveAccount = async (accountId: string) => {
    const toastId = toast.loading("Archiving account...");
    setPendingAccountId(accountId);

    try {
      await archiveMutation.mutateAsync(accountId);
      toast.success("Account archived successfully.", { id: toastId });
    } catch {
      toast.error("Failed to archive account. Please try again.", { id: toastId });
    } finally {
      setPendingAccountId(null);
    }
  };

  const restoreAccount = async (accountId: string) => {
    const toastId = toast.loading("Restoring account...");
    setPendingAccountId(accountId);

    try {
      await restoreMutation.mutateAsync(accountId);
      toast.success("Account restored successfully.", { id: toastId });
    } catch {
      toast.error("Failed to restore account. Please try again.", { id: toastId });
    } finally {
      setPendingAccountId(null);
    }
  };

  return {
    archiveAccount,
    restoreAccount,
    pendingAccountId,
    isPending: archiveMutation.isPending || restoreMutation.isPending,
  };
}

export { useAccountArchiveActions };
