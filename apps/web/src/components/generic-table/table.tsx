import { flexRender, type Row, type Table as TanstackTable } from "@tanstack/react-table";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import type { PaginationState } from "@/hooks/use-pagination-state";
import { CardFrame, CardFrameFooter } from "../ui/card";
import { TablePagination } from "./table-pagination";
import { twMerge } from "tailwind-merge";

type GenericTableProps<T> = {
  pagination?: PaginationState;

  table: TanstackTable<T>;
  onRowClick?: (row: Row<T>) => void;
};
export const GenericTable = <T,>({ pagination, table, onRowClick }: GenericTableProps<T>) => {
  const rows = table.getRowModel().rows;

  return (
    <CardFrame>
      <Table variant="card">
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest("button, input, [role='checkbox'], label")) return;
                  onRowClick?.(row);
                }}
                className={twMerge(!row.getCanSelect() && "opacity-50 pointer-events-none", typeof onRowClick === "function" ? "cursor-pointer" : "")}
              >
                {row.getVisibleCells().map((column) => (
                  <TableCell key={column.id}>{flexRender(column.column.columnDef.cell, column.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={100}>
                <p className="text-sm text-muted-foreground text-center py-4">Nothing here to show</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination ? (
        <CardFrameFooter className="p-2">
          <TablePagination pagination={pagination} />
        </CardFrameFooter>
      ) : null}
    </CardFrame>
  );
};
