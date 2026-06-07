import { format } from "date-fns";
import { CalendarDays, Users } from "lucide-react";

import type { AccountGroupItem } from "@/api/account-groups/type";

type AccountGroupDetailSummaryProps = {
  group: AccountGroupItem;
};

function AccountGroupDetailSummary({ group }: AccountGroupDetailSummaryProps) {
  const stats = [
    {
      icon: Users,
      label: "Accounts",
      value: `${group.accountCount} ${group.accountCount === 1 ? "account" : "accounts"}`,
    },
    {
      icon: CalendarDays,
      label: "Created",
      value: format(new Date(group.createdAt), "MMM d, yyyy"),
    },
    {
      icon: CalendarDays,
      label: "Updated",
      value: format(new Date(group.updatedAt), "MMM d, yyyy"),
    },
  ];

  return (
    <section className="border-border/60 bg-card/40 space-y-4 rounded-xl border p-5 shadow-sm backdrop-blur-sm">
      <div className="space-y-0">
        <h2 className="font-heading text-foreground text-xl font-semibold tracking-tight">
          {group.name}
        </h2>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          {group.description}
        </p>
      </div>

      <div className="border-border/60 grid gap-4 border-t pt-4 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            className="border-border/60 bg-muted/15 flex items-center gap-3 rounded-lg border px-3 py-2.5"
            key={label}
          >
            <Icon className="text-muted-foreground size-4 shrink-0" />
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="text-foreground truncate text-sm font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export { AccountGroupDetailSummary, type AccountGroupDetailSummaryProps };
