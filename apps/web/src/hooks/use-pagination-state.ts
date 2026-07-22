import { useMemo, type Dispatch, type SetStateAction } from "react";

export interface PaginationState {
  pageCount: number;
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  goNextPage: VoidFunction;
  hasNextPage: boolean;
  goPrevPage: VoidFunction;
  hasPrevPage: boolean;
  setPageIndex: Dispatch<SetStateAction<number>>;
}

interface UsePaginationArgs {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  setPageIndex: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
}

export const usePaginationState = ({ pageIndex, pageSize, setPageIndex, setPageSize, totalCount }: UsePaginationArgs): PaginationState => {
  return useMemo(() => {
    const pageCount = Math.ceil(totalCount / pageSize);

    const goNextPage = () => {
      setPageIndex((prev) => {
        return Math.min(pageCount, prev + 1);
      });
    };
    const goPrevPage = () => {
      setPageIndex((prev) => {
        return Math.max(1, prev - 1);
      });
    };

    return {
      pageCount,
      totalCount,
      pageIndex,
      pageSize,
      goNextPage,
      hasNextPage: pageIndex < pageCount,
      goPrevPage,
      hasPrevPage: pageIndex > 1,
      setPageIndex,
      setPageSize,
    };
  }, [totalCount, pageIndex, pageSize]);
};
