import { AttributeCategoryList } from "@/components/AttributeCategory/AttributeCategoryList";
import { GenericTable } from "@/components/GenericTable/GenericTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { createAttribute, fetchAttributes } from "./api";
import { PlusIcon } from "@phosphor-icons/react";
import { FloatingDialog } from "@/components/FloatingDialog";
import { useState, type SubmitEvent } from "react";
import { AttributeType } from "@/types/prisma/enums";
import { Select } from "@/components/Select";
import { rowDataWithFallback } from "@/lib/table/utils";
import toast from "react-hot-toast";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
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
          <FloatingDialog
            render={() => (
              <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="flex items-end gap-2">
                  <div>
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="input"
                      value={attributeName}
                      onChange={(e) => setAttributeName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select
                      items={[
                        { type: AttributeType.TEXT },
                        { type: AttributeType.MARKDOWN },
                        { type: AttributeType.NUMERIC },
                        { type: AttributeType.IMAGE },
                        { type: AttributeType.BOOLEAN },
                        { type: AttributeType.CHOICE },
                        { type: AttributeType.DATE },
                        { type: AttributeType.DATEPERIOD },
                      ]}
                      itemValue={(item) => item.type}
                      itemLabel={(item) => item.type}
                      placeholder="Select type"
                      value={attributeType}
                      onChange={setAttributeType as any}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button className="btn btn-primary">Save</button>
                </div>
              </form>
            )}
          >
            <button disabled={!categoryId} className="btn btn-primary">
              <PlusIcon /> Create
            </button>
          </FloatingDialog>
        </div>
        <div className="flex-1">
          <GenericTable instance={table} />
        </div>
      </div>
    </div>
  );
};
