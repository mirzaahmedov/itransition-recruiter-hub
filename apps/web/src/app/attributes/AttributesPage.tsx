import { AttributeCategoryList } from "@/components/AttributeCategory/AttributeCategoryList";
import { GenericTable } from "@/components/GenericTable/GenericTable";
import { rowDataWithFallback } from "@/lib/table/utils";
import type { AttributeGetPayload } from "@/types/prisma/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import toast from "react-hot-toast";
import { createAttribute, fetchAttributes } from "./api";

import type { AttributeCreatePayload } from "@rh/shared";
import { AttibuteCreateDialog } from "./AttibuteCreateDialog";
import { useDialogState } from "@/hooks/use-dialog-state";

const columns: ColumnDef<
  AttributeGetPayload<{
    include: {
      choices: true;
    };
  }>
>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "choices",
    header: "Choices",
    cell({ row }) {
      return row.original.choices.length;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];

export const AttributesPage = () => {
  const [categoryId, setCategoryId] = useState("");

  const createDialog = useDialogState();
  const queryClient = useQueryClient();

  const { data: attributes } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => fetchAttributes(categoryId!),
    enabled: !!categoryId,
  });

  const createAttributeMutation = useMutation({
    mutationKey: ["createAttribute"],
    mutationFn: createAttribute,
  });

  const table = useReactTable({
    getCoreRowModel: getCoreRowModel(),
    data: rowDataWithFallback(attributes?.data),
    columns,
  });

  const refetchQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["attributes"],
    });
  };

  const handleSubmit = (payload: AttributeCreatePayload) => {
    const { name, type, choices } = payload;

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
    <div className="h-full flex">
      <AttributeCategoryList categoryId={categoryId} onCategoryChange={setCategoryId} />
      <div className="flex-1 flex flex-col">
        <div className="p-2 flex items-center justify-end border-b">
          {categoryId && (
            <AttibuteCreateDialog
              open={createDialog.open}
              onOpenChange={createDialog.setOpen}
              onSubmit={handleSubmit}
              isSubmitting={createAttributeMutation.isPending}
            />
          )}
        </div>
        <div className="flex-1">
          <GenericTable instance={table} />
        </div>
      </div>
    </div>
  );
};
