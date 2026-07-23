import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "../ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Button } from "../ui/button";
import type { FC } from "react";
import type { PaginationState } from "@/hooks/use-pagination-state";

export const TablePagination: FC<{
  pagination: PaginationState;
}> = ({ pagination }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 whitespace-nowrap">
        <p className="text-muted-foreground text-sm">Viewing</p>
        <Select
          disabled={pagination.totalCount === 0}
          items={Array.from({ length: pagination.pageCount }, (_, i) => {
            const start = i * pagination.pageSize + 1;
            const end = Math.min((i + 1) * pagination.pageSize, pagination.totalCount);
            const pageNum = i + 1;
            return { label: `${start}-${end}`, value: pageNum };
          })}
          onValueChange={(value) => {
            pagination.setPageIndex(value ?? 1);
          }}
          value={pagination.totalCount === 0 ? 0 : pagination.pageIndex}
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
  );
};
