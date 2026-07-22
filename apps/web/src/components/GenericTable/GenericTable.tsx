import { flexRender, type Row, type Table as TanstackTable } from "@tanstack/react-table";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { FrameFooter } from "../ui/frame";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Button } from "../ui/button";
import type { PaginationState } from "@/hooks/use-pagination-state";
import { CardFrame } from "../ui/card";

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
                className={typeof onRowClick === "function" ? "cursor-pointer" : ""}
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
        <FrameFooter className="p-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <p className="text-muted-foreground text-sm">Viewing</p>
              <Select
                items={Array.from({ length: pagination.pageCount }, (_, i) => {
                  const start = i * pagination.pageSize + 1;
                  const end = Math.min((i + 1) * pagination.pageSize, pagination.totalCount);
                  const pageNum = i + 1;
                  return { label: `${start}-${end}`, value: pageNum };
                })}
                onValueChange={(value) => {
                  pagination.setPageIndex(value ?? 1);
                }}
                value={pagination.pageIndex}
              >
                <SelectTrigger aria-label="Select result range" className="w-fit min-w-none" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectPopup>
                  {Array.from({ length: pagination.pageCount }, (_, i) => {
                    const start = i * pagination.pageSize + 1;
                    const end = Math.min((i + 1) * pagination.pageSize, pagination.totalCount);
                    const pageNum = i + 1;
                    return (
                      <SelectItem key={pageNum} value={pageNum}>
                        {`${start}-${end}`}
                      </SelectItem>
                    );
                  })}
                </SelectPopup>
              </Select>
              <p className="text-muted-foreground text-sm">
                of <strong className="font-medium text-foreground">{pagination.totalCount}</strong> results
              </p>
            </div>
            <Pagination className="justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="sm:*:[svg]:hidden"
                    render={<Button disabled={!pagination.hasPrevPage} onClick={() => pagination.goPrevPage()} size="sm" variant="outline" />}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className="sm:*:[svg]:hidden"
                    render={<Button disabled={!pagination.hasNextPage} onClick={() => pagination.goNextPage()} size="sm" variant="outline" />}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </FrameFooter>
      ) : null}
    </CardFrame>
  );
};
