import { GenericTable } from "@/components/GenericTable/GenericTable";
import { rowDataWithFallback } from "@/lib/table/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { createAttribute, fetchAttributes } from "./api";

import type { AttributeCreatePayload } from "@rh/shared";
import { AttibuteCreateDialog } from "./AttibuteCreateDialog";
import { useDialogState } from "@/hooks/use-dialog-state";
import type { AttributeGetPayload } from "@rh/database/models";
import { Spinner } from "@/components/ui/spinner";

const columns: ColumnDef<
  AttributeGetPayload<{
    include: {
      choices: true;
      category: true;
    };
  }>
>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => row.original.category.name,
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
    columns,
  });

  const refetchQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["attributes"],
    });
  };

  const handleSubmit = (payload: AttributeCreatePayload) => {
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
    <div className="h-full flex">
      <div className="flex-1 flex flex-col">
        <div className="p-2 flex items-center justify-end border-b">
          <AttibuteCreateDialog
            open={createDialog.open}
            onOpenChange={createDialog.setOpen}
            onSubmit={handleSubmit}
            isSubmitting={createAttributeMutation.isPending}
          />
        </div>
        <div className="flex-1">{isLoading ? <Spinner /> : <GenericTable instance={table} />}</div>
      </div>
    </div>
  );
};
