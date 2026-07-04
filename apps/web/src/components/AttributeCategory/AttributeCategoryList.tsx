import type { AttributeCategory } from "@/types/prisma/browser";
import type { AttributeCategoryUpdateInput } from "@/types/prisma/models";
import { FolderIcon, PencilSimpleLineIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FC, type SubmitEvent } from "react";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { createCategory, deleteCategory, fetchCategories, updateCategory } from "./api";

export const AttributeCategoryList: FC<{
  categoryId: string;
  onCategoryChange: (id: string) => void;
}> = ({ categoryId, onCategoryChange }) => {
  const [editingCategory] = useState<AttributeCategory>();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const queryClient = useQueryClient();

  const refetchQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["attribute_categories"],
    });
  };

  const { data: categories } = useQuery({
    queryKey: ["attribute_categories"],
    queryFn: fetchCategories,
  });

  const createCategoryMutation = useMutation({
    mutationKey: ["createCategory"],
    mutationFn: createCategory,
  });
  const updateCategoryMutation = useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: (payload: AttributeCategoryUpdateInput) => updateCategory(editingCategory!.id, payload),
  });
  const deleteCategoryMutation = useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: deleteCategory,
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    if (!editingCategory) {
      createCategoryMutation.mutate(
        {
          name: categoryName,
        },
        {
          onSuccess: () => {
            toast.success("Created category");
            refetchQueries();
            setCategoryName("");
          },
          onError: () => {
            toast.error("Failed to create category");
          },
        },
      );
    }
  };

  return (
    <div className="w-full max-w-xs border-r border-base-divider h-full flex flex-col">
      <ul className="menu w-full flex-1">
        {categories?.data?.map((category) => (
          <li key={category.id} className="relative group">
            <button onClick={() => onCategoryChange(category.id)} className={twMerge("py-2", categoryId === category.id && "menu-active")}>
              <FolderIcon className="icon" /> {category.name}
            </button>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 invisible group-hover:visible menu-title flex items-center gap-1">
              <button className="btn btn-ghost btn-sm btn-circle">
                <PencilSimpleLineIcon className="icon" />
              </button>
              <button
                onClick={() =>
                  deleteCategoryMutation.mutate(category.id, {
                    onSuccess: () => {
                      refetchQueries();
                    },
                  })
                }
                className="btn btn-error btn-sm btn-circle"
              >
                {deleteCategoryMutation.isPending && deleteCategoryMutation.variables === category.id ? (
                  <span className="loading loading-sm loading-spinner"></span>
                ) : (
                  <TrashIcon className="icon" />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isFormVisible ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 border-t border-base-divider">
          <input type="text" className="input flex-1" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
          <button disabled={!categoryName} className="btn btn-sm btn-primary" type="submit">
            {(createCategoryMutation.isPending || updateCategoryMutation.isPending) && <span className="loading loading-sm loading-spinner"></span>}
            Save
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => setIsFormVisible(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div className="p-2">
          <button className="w-full btn btn-primary" onClick={() => setIsFormVisible(true)}>
            <PlusIcon className="icon" /> Create
          </button>
        </div>
      )}
    </div>
  );
};
