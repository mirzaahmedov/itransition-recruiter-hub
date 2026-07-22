import { GenericTable } from "@/components/GenericTable/GenericTable";
import { rowDataWithFallback } from "@/lib/table/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { createAttribute, fetchAttributes } from "./api";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDialogState } from "@/hooks/use-dialog-state";
import { PlusIcon } from "@phosphor-icons/react";
import type { CreateAttributePayload } from "@rh/shared";
import { AttibuteCreateDialog } from "./AttibuteCreateDialog";
import { attributeColumns } from "./columns";

export const AttributesPage = () => {
  const createDialog = useDialogState();
  const queryClient = useQueryClient();

  const { data: attributes, isLoading } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => fetchAttributes(),
  });

  const createAttributeMutation = useMutation({
    mutationKey: ["createAttribute"],
    mutationFn: createAttribute,
  });

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    data: rowDataWithFallback(attributes?.data),
    columns: attributeColumns,
  });

  const refetchQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["attributes"],
    });
  };

  const handleSubmit = (payload: CreateAttributePayload) => {
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
          onSubmit={handleSubmit}
          isSubmitting={createAttributeMutation.isPending}
          trigger={
            <Button>
              <PlusIcon />
              New Attribute
            </Button>
          }
        />
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <GenericTable instance={table} />
        )}
      </div>
    </div>
  );
};
