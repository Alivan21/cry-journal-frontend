import { format } from "date-fns";
import { Archive, ArchiveRestore, Building2, Coins, Globe, Layers, Wallet } from "lucide-react";

import type { AccountItem } from "@/api/accounts/type";
import { formatBalance } from "@/common/utils/format-balance";
import { ActionMenu } from "@/components/ui/action-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/libs/clsx";

type AccountCardProps = {
  account: AccountItem;
  archived?: boolean;
  disabled?: boolean;
  onArchive?: (accountId: string) => void | Promise<void>;
  onRestore?: (accountId: string) => void | Promise<void>;
};

function AccountCard({
  account,
  archived = false,
  disabled = false,
  onArchive,
  onRestore,
}: AccountCardProps) {
  const actions = archived
    ? [
        {
          label: "Restore",
          icon: ArchiveRestore,
          onClick: () => {
            void onRestore?.(account.id);
          },
          disabled,
        },
      ]
    : [
        {
          label: "Archive",
          icon: Archive,
          onClick: () => {
            void onArchive?.(account.id);
          },
          disabled,
        },
      ];

  const details = [
    {
      icon: Building2,
      label: "Broker",
      value: account.broker,
    },
    {
      icon: Layers,
      label: "Type",
      value: account.accountType,
    },
    {
      icon: Coins,
      label: "Currency",
      value: account.baseCurrency,
    },
    {
      icon: Globe,
      label: "Timezone",
      value: account.timezone,
    },
  ];

  return (
    <Card className={cn(archived && "opacity-80")} interactive>
      <CardContent className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="border-border bg-background/70 flex size-10 shrink-0 items-center justify-center rounded-xl border shadow-sm">
            <Wallet className="text-primary size-4.5" />
          </div>

          <div className="flex items-center gap-2">
            {archived ? (
              <Badge className="font-normal" variant="secondary">
                Archived
              </Badge>
            ) : null}
            <ActionMenu actions={actions} />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-heading text-foreground line-clamp-1 text-base font-semibold">
            {account.name}
          </h3>
          <p className="text-muted-foreground text-sm">
            Starting balance{" "}
            <span className="text-foreground font-medium">
              {formatBalance(account.startingBalance, account.baseCurrency)}
            </span>
          </p>
        </div>

        <dl className="grid gap-2.5">
          {details.map(({ icon: Icon, label, value }) => (
            <div className="flex items-center gap-2.5" key={label}>
              <Icon className="text-muted-foreground size-3.5 shrink-0" />
              <dt className="text-muted-foreground sr-only">{label}</dt>
              <dd className="text-foreground line-clamp-1 text-sm uppercase">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>

      <CardFooter>Updated {format(new Date(account.updatedAt), "MMM d, yyyy")}</CardFooter>
    </Card>
  );
}

export { AccountCard, type AccountCardProps };
