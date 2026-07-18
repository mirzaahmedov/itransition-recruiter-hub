import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fallbackName } from "@/utils/fallbackName";
import { GearSixIcon } from "@phosphor-icons/react";
import type { User } from "@rh/database/browser";
import type { FC } from "react";
import type { UserAttributeWithJoins } from "./api";
import { useCategoryStore } from "@/store/useCategoryStore";
import { renderDynamicValue } from "@/utils/renderDynamicValue";

export const ProfileView: FC<{
  user: User;
  userAttributes: UserAttributeWithJoins[];
  onEdit: VoidFunction;
}> = ({ user, userAttributes, onEdit }) => {
  const categories = useCategoryStore((store) => store.categories);

  const readCategoryAttributes = (categoryId: string) => {
    return userAttributes.filter((attr) => attr.attribute.categoryId === categoryId);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-brand/20 via-brand/10 to-transparent" />
        <div className="px-8 pb-8">
          <div className="flex items-end gap-5 -mt-12">
            <Avatar className="size-24 ring-4 ring-card">
              <AvatarImage src={user.avatar ?? undefined} alt={user.name ?? "Avatar"} />
              <AvatarFallback className="text-3xl">{fallbackName(user.name ?? "User")}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Button onClick={onEdit}>
              <GearSixIcon />
              Edit profile
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {categories?.map((category) => {
          const attrs = readCategoryAttributes(category.id);
          return (
            <div key={category.id} className="rounded-2xl border bg-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{category.name}</h3>
              <div className="mt-4">
                {attrs.length > 0 ? (
                  <dl className="space-y-3">
                    {attrs.map((attr) => (
                      <div key={attr.id} className="flex items-center justify-between gap-4">
                        <dt className="text-sm text-muted-foreground shrink-0">{attr.attribute.name}</dt>
                        <span className="flex-1 border-b border-dotted border-border" />
                        <dd className="text-sm font-medium">{renderDynamicValue(attr.attribute.type, attr)}</dd>
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
    </div>
  );
};
