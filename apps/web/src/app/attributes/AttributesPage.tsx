import { GenericTable } from "@/components/generic-table";
import { countSelectRows, rowDataWithFallback, rowSelectionToArray } from "@/lib/table/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable, type RowSelectionState } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { bulkDeleteAttributes, createAttribute, fetchAttributes, renameAttribute } from "./api";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDialogState } from "@/hooks/use-dialog-state";
import { MagnifyingGlassIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import type { CreateAttributePayload, UpdateAttributePayload } from "@rh/shared";
import { AttibuteCreateDialog } from "./AttibuteCreateDialog";
import { AttributeDetailDialog } from "./AttributeDetailDialog";
import { attributeColumns } from "./columns";
import { useEffect, useState } from "react";
import type { AttributeWithUsage } from "./api";
import { usePaginationState } from "@/hooks/use-pagination-state";
import { useDebounce } from "@uidotdev/usehooks";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const AttributesPage = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeWithUsage | null>(null);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");

  const createDialog = useDialogState();
  const detailDialog = useDialogState();
  const queryClient = useQueryClient();

  const debouncedSearch = useDebounce(search, 500);
  const selectedCount = countSelectRows(rowSelection);
  const selectedIds = rowSelectionToArray(rowSelection);

  const { data: attributes, isLoading } = useQuery({
    queryKey: [
      "attributes",
      {
        pageIndex,
        pageSize,
        debouncedSearch,
      },
    ],
    queryFn: () =>
      fetchAttributes({
        pageIndex,
        pageSize,
        search: debouncedSearch,
      }),
  });

  const pagination = usePaginationState({
    totalCount: attributes?.totalCount ?? 0,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
  });

  const createAttributeMutation = useMutation({
    mutationKey: ["createAttribute"],
    mutationFn: createAttribute,
  });

  const renameAttributeMutation = useMutation({
    mutationKey: ["renameAttribute"],
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAttributePayload }) => renameAttribute(id, payload),
    onSuccess() {
      refetchQueries();
      toast.success("Renamed successfully");
      detailDialog.closeDialog();
      setSelectedAttribute(null);
    },
    onError() {
      toast.error("Rename failed");
    },
  });

  const bulkDeleteAttributesMutation = useMutation({
    mutationFn: () => bulkDeleteAttributes(selectedIds),
    onSuccess(res) {
      const deletedCount = res?.data?.deleted ?? 0;
      toast.success(`Deleted ${deletedCount} attributes`);
      setRowSelection({});
      refetchQueries();
    },
    onError(error: any) {
      const message = error?.response?.data?.message || "Delete failed";
      toast.error(message);
    },
  });

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    data: rowDataWithFallback(attributes?.data),
    columns: attributeColumns,
    state: {
      rowSelection,
    },
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
  });

  const refetchQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["attributes"],
    });
  };

  const handleCreateSubmit = (payload: CreateAttributePayload) => {
    const { name, type, choices, categoryId } = payload;

    createAttributeMutation.mutate(
      {
        name,
        type,
        choices,
        categoryId,
      },
      {
        onSuccess() {
          refetchQueries();
          toast.success("Created successfully");
          createDialog.closeDialog();
        },
        onError() {
          toast.error("Create failed");
        },
      },
    );
  };

  const handleRename = (id: string, payload: UpdateAttributePayload) => {
    renameAttributeMutation.mutate({ id, payload });
  };

  const handleDelete = () => {
    bulkDeleteAttributesMutation.mutate();
  };

  const handleRowClick = (row: any) => {
    setSelectedAttribute(row.original);
    detailDialog.openDialog();
  };

  useEffect(() => {
    setPageIndex(1);
  }, [search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Attributes</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage attribute definitions</p>
        </div>

        <div className="flex items-center gap-5">
          <InputGroup className="max-w-60">
            <InputGroupInput size="lg" aria-label="Search" placeholder="Search" type="search" value={search} onValueChange={setSearch} />
            <InputGroupAddon>
              <MagnifyingGlassIcon aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>
          <AttibuteCreateDialog
            open={createDialog.open}
            onOpenChange={createDialog.setOpen}
            onSubmit={handleCreateSubmit}
            isSubmitting={createAttributeMutation.isPending}
            trigger={
              <Button>
                <PlusIcon />
                Create attribute
              </Button>
            }
          />
        </div>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-3 mb-4 rounded-xl border bg-card p-3">
          <span className="text-sm text-muted-foreground mr-1">
            <b>{selectedCount}</b> user{selectedCount !== 1 ? "s" : ""} selected
          </span>

          <div className="h-5 w-px bg-border" />

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button size="sm" variant="destructive-outline">
                  <TrashIcon className="size-4" />
                  Delete unused
                </Button>
              }
            />
            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete {selectedCount} attribute{selectedCount !== 1 ? "s" : ""}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The selected users and all their data will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose render={<Button variant="ghost" />}>Cancel</AlertDialogClose>
                <AlertDialogClose render={<Button variant="destructive" loading={bulkDeleteAttributesMutation.isPending} />} onClick={handleDelete}>
                  Delete
                </AlertDialogClose>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>
        </div>
      )}

      <div className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <GenericTable table={table} onRowClick={handleRowClick} pagination={pagination} />
        )}
      </div>

      <AttributeDetailDialog
        open={detailDialog.open}
        onOpenChange={detailDialog.setOpen}
        attribute={selectedAttribute}
        onRename={handleRename}
        isRenaming={renameAttributeMutation.isPending}
      />
    </div>
  );
};
