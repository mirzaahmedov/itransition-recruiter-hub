import { AttributeCategoryList } from "@/components/AttributeCategory/AttributeCategoryList";
import { GenericTable } from "@/components/GenericTable/GenericTable";
import { rowDataWithFallback } from "@/lib/table/utils";
import { AttributeType } from "@/types/prisma/enums";
import type { AttributeGetPayload } from "@/types/prisma/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { useState, type SubmitEvent } from "react";
import toast from "react-hot-toast";
import { createAttribute, fetchAttributes } from "./api";

import { AttibuteCreateDialog } from "./AttibuteCreateDialog";

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
  const [attributeName, setAttributeName] = useState("");
  const [attributeType, setAttributeType] = useState<AttributeType>(AttributeType.TEXT);

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

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    createAttributeMutation.mutate(
      {
        name: attributeName,
        type: attributeType,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
      {
        onSuccess() {
          refetchQueries();
          toast.success("Created successfully");
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
        <div className="px-5 py-2 border-b border-base-divider">
          <AttibuteCreateDialog onSubmit={console.log} />
        </div>
        <div className="flex-1">
          <GenericTable instance={table} />
        </div>
      </div>
    </div>
  );
};
