import { GenericTable } from "@/components/GenericTable/GenericTable";
import { rowDataWithFallback } from "@/lib/table/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { createAttribute, deleteAttribute, fetchAttributes, renameAttribute } from "./api";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDialogState } from "@/hooks/use-dialog-state";
import { PlusIcon } from "@phosphor-icons/react";
import type { CreateAttributePayload, UpdateAttributePayload } from "@rh/shared";
import { AttibuteCreateDialog } from "./AttibuteCreateDialog";
import { AttributeDetailDialog } from "./AttributeDetailDialog";
import { attributeColumns } from "./columns";
import { useState } from "react";
import type { AttributeWithUsage } from "./api";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { usePaginationState } from "@/hooks/use-pagination-state";

export const AttributesPage = () => {
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeWithUsage | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [search, setSearch] = useState("");

  const createDialog = useDialogState();
  const detailDialog = useDialogState();
  const queryClient = useQueryClient();

  const {
    data: attributes,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => fetchAttributes(),
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

  const deleteAttributeMutation = useMutation({
    mutationKey: ["deleteAttribute"],
    mutationFn: deleteAttribute,
    onSuccess() {
      refetchQueries();
      toast.success("Deleted successfully");
      detailDialog.closeDialog();
      setSelectedAttribute(null);
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
    onRowSelectionChange: () => {},
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

  const handleDelete = (id: string) => {
    deleteAttributeMutation.mutate(id);
  };

  const handleRowClick = (row: any) => {
    setSelectedAttribute(row.original);
    detailDialog.openDialog();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Attributes</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage attribute definitions</p>
        </div>
        <AttibuteCreateDialog
          open={createDialog.open}
          onOpenChange={createDialog.setOpen}
          onSubmit={handleCreateSubmit}
          isSubmitting={createAttributeMutation.isPending}
          trigger={
            <Button>
              <PlusIcon />
              New Attribute
            </Button>
          }
        />
      </div>

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
        onDelete={handleDelete}
        isRenaming={renameAttributeMutation.isPending}
        isDeleting={deleteAttributeMutation.isPending}
      />
    </div>
  );
};
