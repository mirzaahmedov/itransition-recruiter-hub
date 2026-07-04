import type { RowSelectionState } from "@tanstack/react-table";

export function countSelectRows(rowSelection: RowSelectionState) {
  return Object.values(rowSelection).filter(Boolean).length;
}

export function rowSelectionToArray(rowSelection: RowSelectionState) {
  return Object.entries(rowSelection)
    .filter(([, value]) => Boolean(value))
    .map(([key]) => key);
}

const emptyArray: unknown[] = [];
export function rowDataWithFallback<T>(rowData: T[] | undefined | null) {
  return rowData ?? (emptyArray as T[]);
}
