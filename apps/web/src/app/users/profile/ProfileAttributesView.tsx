import { Button } from "@/components/ui/button";
import { useCategoryStore } from "@/store/useCategoryStore";
import { renderDynamicValue } from "@/utils/renderDynamicValue";
import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import type { FC } from "react";
import type { UserAttributeWithJoins } from "./api";

export const ProfileAttributesView: FC<{
  userAttributes: UserAttributeWithJoins[];
  onEdit: VoidFunction;
}> = ({ userAttributes, onEdit }) => {
  const categories = useCategoryStore((store) => store.categories);

  const readCategoryAttributes = (categoryId: string) => {
    return userAttributes.filter((attr) => attr.attribute.categoryId === categoryId);
  };

  return (
    <div className="mt-8 space-y-6">
      {categories?.map((category) => {
        const attrs = readCategoryAttributes(category.id);
        return (
          <div key={category.id} className="rounded-2xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{category.name}</h3>
              <div className="flex items-center gap-1">
                <Button variant="link" onClick={onEdit}>
                  <PencilSimpleLineIcon />
                  Edit
                </Button>
              </div>
            </div>
            <div className="mt-4">
              {attrs.length > 0 ? (
                <dl className="space-y-5">
                  {attrs.map((attr) => (
                    <div key={attr.id} className="flex items-start justify-between gap-10">
                      <div className="flex items-end gap-4 shrink-0 w-full max-w-40">
                        <dt className="text-sm text-muted-foreground">{attr.attribute.name}</dt>
                        <span className="flex-1 border-b border-dotted border-border" />
                      </div>
                      <dd className="w-full">
                        <div className="max-w-100 text-sm font-medium">{renderDynamicValue(attr.attribute.type, attr)}</div>
                      </dd>
                      <span className="w-20"></span>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No attributes added yet</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
