import { useCategories } from "@/app/categories/useCategories";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fallbackName } from "@/utils/fallbackName";
import { PencilSimpleLineIcon } from "@phosphor-icons/react";
import type { User } from "@rh/database/browser";
import { readDynamicValue } from "@rh/shared/utils";
import type { FC } from "react";
import type { UserProfileWithAttributes } from "./api";

export const ProfileView: FC<{
  user: User;
  userProfile: UserProfileWithAttributes;
  onEdit: VoidFunction;
}> = ({ user, userProfile }) => {
  const categories = useCategories();

  const readCategoryAttributes = (categoryId: string) => {
    return userProfile.attrs.filter((attr) => attr.attribute.categoryId === categoryId);
  };

  return (
    <div className="divide-y mx-auto max-w-4xl">
      <div className="p-5 flex items-start gap-10">
        <Avatar className="size-40">
          <AvatarImage src={user.avatar ?? undefined} alt={user.name ?? "Avatar"} />
          <AvatarFallback>{fallbackName(user.name ?? "User")}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <p>{user.email}</p>
          <div className="mt-10">
            <Button variant="outline">
              <PencilSimpleLineIcon />
              Edit
            </Button>
          </div>
        </div>
      </div>
      <div className="p-5 divide-y">
        {categories?.map((category) => {
          const attrs = readCategoryAttributes(category.id);
          return (
            <div key={category.id} className="py-5">
              <h3 className="uppercase text-sm font-bold text-brand">{category.name}</h3>
              <ul className="mt-5">
                {attrs.length > 0 ? (
                  attrs.map((attr) => (
                    <li key={attr.id} className="flex justify-between">
                      <span>{attr.attribute.name}</span>
                      <b>{readDynamicValue(attr.attribute.type, attr)}</b>
                    </li>
                  ))
                ) : (
                  <li className="col-span-full text-center text-muted-foreground">Nothing to show</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
