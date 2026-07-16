import { useCategories } from "@/app/categories/useCategories";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fallbackName } from "@/utils/fallbackName";
import { PencilSimpleLineIcon, PlusIcon } from "@phosphor-icons/react";
import type { User } from "@rh/database/browser";
import { readDynamicValue } from "@rh/shared/utils";
import type { FC } from "react";
import type { UserProfileWithAttributes } from "./api";
import AttributePicker from "./AttributePicker";
import { useDialogState } from "@/hooks/use-dialog-state";

export const ProfileView: FC<{
  user: User;
  userProfile: UserProfileWithAttributes;
  onEdit: VoidFunction;
}> = ({ user, userProfile, onEdit }) => {
  const categories = useCategories();

  const createDialog = useDialogState();

  const readCategoryAttributes = (categoryId: string) => {
    return userProfile.attrs.filter((attr) => attr.attribute.categoryId === categoryId);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="p-5 flex items-start gap-10">
        <Avatar className="size-40">
          <AvatarImage src={user.avatar ?? undefined} alt={user.name ?? "Avatar"} />
          <AvatarFallback className="text-6xl">{fallbackName(user.name ?? "User")}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <p>{user.email}</p>
          <div className="mt-10 flex justify-end">
            <Button onClick={onEdit}>
              <PencilSimpleLineIcon />
              Edit profile
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        {categories?.map((category) => {
          const attrs = readCategoryAttributes(category.id);
          return (
            <div key={category.id} className="p-5 bg-black/20 rounded-xl">
              <div className="flex items-center justify-between gap-5">
                <h3 className="uppercase text-xs font-semibold">{category.name}</h3>
                <Button variant="outline" onClick={createDialog.openDialog}>
                  <PlusIcon />
                  Add attribute
                </Button>
              </div>
              <ul className="mt-5">
                {attrs.length > 0 ? (
                  attrs.map((attr) => (
                    <li key={attr.id} className="flex justify-between">
                      <span>{attr.attribute.name}</span>
                      <span className="flex-1 border-b border-border border-dotted"></span>
                      <b>{readDynamicValue(attr.attribute.type, attr)}</b>
                    </li>
                  ))
                ) : (
                  <li className="col-span-full text-sm text-center text-muted-foreground">Nothing to show</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>

      <AttributePicker open={createDialog.open} onOpenChange={createDialog.setOpen} />
    </div>
  );
};
