import { useCategoryStore } from "@/store/use-category-store";
import { renderDynamicValue } from "@/utils/renderDynamicValue";
import type { FC } from "react";
import type { UserAttributeWithJoins } from "./api";

export const ProfileAttributesView: FC<{
  userAttributes: UserAttributeWithJoins[];
}> = ({ userAttributes }) => {
  const categories = useCategoryStore((store) => store.categories);

  const readCategoryAttributes = (categoryId: string) => {
    return userAttributes.filter((attr) => attr.attribute.categoryId === categoryId);
  };

  return (
    <div className="mt-8 space-y-6">
      {categories?.map((category) => {
        const attrs = readCategoryAttributes(category.id);
        return (
          <div key={category.id} className="rounded-2xl border bg-card p-3 md:p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{category.name}</h3>
            </div>
            <div className="mt-4">
              {attrs.length > 0 ? (
                <dl className="space-y-5">
                  {attrs.map((attr) => (
                    <div key={attr.id} className="flex flex-col gap-2 rounded-lg py-2 md:flex-row md:items-start md:gap-4">
                      <div className="flex items-center gap-2 md:w-48 md:shrink-0">
                        <dt className="text-sm font-medium text-muted-foreground">{attr.attribute.name}</dt>
                        <span className="hidden flex-1 border-b border-dotted border-border md:block mt-2" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <dd className="text-sm font-medium">{renderDynamicValue(attr.attribute.type, attr)}</dd>
                      </div>
                      <div className="md:w-28 md:shrink-0"></div>
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
