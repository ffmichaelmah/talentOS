import type { LucideIcon } from "lucide-react";

import { EmptyStateCard } from "@/components/cards/empty-state-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  header: string;
  /** Applied to both the header and body cells, e.g. "text-right". */
  className?: string;
  cell: (row: T) => React.ReactNode;
}

/**
 * Display-only table for the dashboard shell. Sorting, filters, and
 * pagination arrive with real CRUD later.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyIcon,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Data you create will show up here.",
  className,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}) {
  if (rows.length === 0 && emptyIcon) {
    return (
      <EmptyStateCard
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <Card className={cn("shadow-xs", className)}>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.header} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={rowKey(row)}>
                {columns.map((col) => (
                  <TableCell key={col.header} className={col.className}>
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
