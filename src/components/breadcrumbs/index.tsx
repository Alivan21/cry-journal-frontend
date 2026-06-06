import { Fragment } from "react";
import { Link } from "react-router";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/libs/clsx";

import type { ReactNode } from "react";

export type BreadcrumbsItem = {
  text: ReactNode;
  url?: string;
};

const EMPTY_ITEMS: BreadcrumbsItem[] = [];

type BreadcrumbsProps = {
  items?: BreadcrumbsItem[];
  className?: string;
};

function BreadcrumbLabel({ children }: { children: ReactNode }) {
  return <span className="truncate">{children}</span>;
}

function BreadcrumbItemList({
  item,
  isCurrentPage,
}: {
  item: BreadcrumbsItem;
  isCurrentPage: boolean;
}) {
  if (isCurrentPage || !item?.url) {
    return (
      <BreadcrumbPage className="max-w-48 truncate">
        <BreadcrumbLabel>{item?.text}</BreadcrumbLabel>
      </BreadcrumbPage>
    );
  }

  return (
    <BreadcrumbLink asChild className="max-w-48 truncate">
      <Link to={item?.url}>
        <BreadcrumbLabel>{item.text}</BreadcrumbLabel>
      </Link>
    </BreadcrumbLink>
  );
}

export function Breadcrumbs({ items = EMPTY_ITEMS, className }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  const shouldCollapse = items.length > 3;
  const firstItem = items[0];
  const lastItem = items[items.length - 1];
  const middleItems = items.slice(1, -1);

  return (
    <Breadcrumb className={cn("min-w-0", className)}>
      <BreadcrumbList className="min-w-0 flex-nowrap overflow-hidden">
        {shouldCollapse ? (
          <>
            <BreadcrumbItem className="min-w-0 shrink">
              <BreadcrumbItemList isCurrentPage={false} item={firstItem} />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Show hidden breadcrumbs"
                    className="size-8 rounded-lg"
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <BreadcrumbEllipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {middleItems.map((item) => (
                    <DropdownMenuItem asChild={Boolean(item.url)} key={item.url}>
                      {item.url ? <Link to={item.url}>{item.text}</Link> : <span>{item.text}</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="min-w-0 shrink">
              <BreadcrumbItemList isCurrentPage={true} item={lastItem} />
            </BreadcrumbItem>
          </>
        ) : (
          items.map((item, index) => {
            const isCurrentPage = index === items.length - 1;

            return (
              <Fragment key={item.url ?? "current-page"}>
                <BreadcrumbItem className="min-w-0 shrink">
                  <BreadcrumbItemList isCurrentPage={isCurrentPage} item={item} />
                </BreadcrumbItem>
                {!isCurrentPage ? <BreadcrumbSeparator /> : null}
              </Fragment>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
