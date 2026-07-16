import { AttributeEditor } from "@/components/AttributeEditor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDialogState } from "@/hooks/use-dialog-state";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import { useCategoryStore } from "@/store/useCategoryStore";
import { fallbackName } from "@/utils/fallbackName";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import type { User } from "@rh/database/browser";
import type { ProfileAttributeUpdatePayload } from "@rh/shared";
import { getDynamicDefaultValue, getDynamicValueObject, readDynamicValue } from "@rh/shared/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { createBulkUserAttributes, updateProfileAttribute, uploadProfilePicture, type UserAttributeWithJoins } from "./api";
import { AttributePicker } from "./AttributePicker";

const ProfileForm: FC<{
  user: User;
  userAttributes: UserAttributeWithJoins[];
  onStop: VoidFunction;
}> = ({ user, userAttributes, onStop }) => {
  const timers = useRef<Record<string, number>>({});

  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      attrs: {} as Record<string, any>,
    },
  });

  const categories = useCategoryStore((store) => store.categories);
  const createDialog = useDialogState();

  const createUserAttributeMutation = useMutation({
    mutationFn: createBulkUserAttributes,
  });

  const uploadProfilePictureMutation = useMutation({
    mutationFn: (file: File) => uploadProfilePicture(user.id, file),
  });

  const updateProfileAttributeMutation = useMutation({
    mutationFn: ({ id, version, payload }: { id: string; version: number; payload: ProfileAttributeUpdatePayload }) =>
      updateProfileAttribute({
        id,
        userId: user.id,
        version,
        data: payload,
      }),
  });

  useEffect(() => {
    if (Array.isArray(userAttributes)) {
      form.reset({
        attrs: userAttributes.reduce(
          (result, item) => {
            result[item.id] = readDynamicValue(item.attribute.type, item) ?? getDynamicDefaultValue(item.attribute.type);
            return result;
          },
          {} as Record<string, any>,
        ),
      });
    } else {
      form.reset({
        attrs: {},
      });
    }
  }, [userAttributes]);

  const handleChangeField = (attr: UserAttributeWithJoins, value: any) => {
    if (timers.current[attr.id]) {
      clearTimeout(timers.current[attr.id]);
    }

    const timeoutId = setTimeout(() => {
      updateProfileAttributeMutation.mutate({
        id: attr.id,
        version: attr.version,
        payload: getDynamicValueObject(value, attr.attribute.type) as any,
      });
    }, 1000);

    timers.current[attr.id] = timeoutId;
  };

  const handleUploadImage = (data: FileWithPreview) => {
    if (data.file instanceof File) {
      uploadProfilePictureMutation.mutate(data.file);
    }
  };

  const readCategoryAttributes = (categoryId: string) => {
    return userAttributes.filter((attr) => attr.attribute.categoryId === categoryId);
  };

  const handleCreateAttributes = async (attrIds: string[]) => {
    createUserAttributeMutation
      .mutateAsync({
        ids: attrIds,
        userId: user.id,
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["users", user.id, "profile"],
        });
      });
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
            <Button variant="destructive" onClick={onStop}>
              <XIcon />
              Stop editing
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
                    <li key={attr.id} className="flex justify-between items-center">
                      <span>{attr.attribute.name}</span>
                      <span>
                        <Controller
                          control={form.control}
                          name={`attrs.${attr.id}`}
                          render={({ field }) => (
                            <AttributeEditor
                              type={attr.attribute.type}
                              value={field.value}
                              onValueChange={(value) => {
                                handleChangeField(attr, value);
                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                      </span>
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

      <AttributePicker open={createDialog.open} onOpenChange={createDialog.setOpen} onSelect={handleCreateAttributes} />
    </div>
  );
};

export default ProfileForm;
