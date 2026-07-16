import { AttributeEditor } from "@/components/AttributeEditor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDialogState } from "@/hooks/use-dialog-state";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import { useCategoryStore } from "@/store/useCategoryStore";
import { fallbackName } from "@/utils/fallbackName";
import { FloppyDiskIcon, PlusIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import type { User } from "@rh/database/browser";
import type { ProfileAttributeUpdatePayload } from "@rh/shared";
import { getDynamicDefaultValue, getDynamicValueObject, readDynamicValue } from "@rh/shared/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  bulkUpdateProfileAttributes,
  createBulkUserAttributes,
  uploadProfilePicture,
  type BulkUpdateUserAttributeArgs,
  type UserAttributeWithJoins,
} from "./api";
import { AttributePicker } from "./AttributePicker";
import { useAutoSave } from "./useAutoSave";
import { Badge } from "@/components/ui/badge";

interface UserAttributeUpdateArgs {
  id: string;
  version: number;
  payload: ProfileAttributeUpdatePayload;
}
interface ProfileFormData {
  attrs: Record<
    string,
    {
      attr: UserAttributeWithJoins;
      value: any;
    }
  >;
}

const ProfileForm: FC<{
  user: User;
  userAttributes: UserAttributeWithJoins[];
  onStopEditing: VoidFunction;
}> = ({ user, userAttributes, onStopEditing }) => {
  const queryClient = useQueryClient();

  const [conflicts, setConflicts] = useState<Record<string, boolean>>({});

  const form = useForm<ProfileFormData>({
    defaultValues: {
      attrs: {},
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
    mutationFn: ({ data }: Omit<BulkUpdateUserAttributeArgs, "userId">) =>
      bulkUpdateProfileAttributes({
        userId: user.id,
        data,
      }),
  });

  const handleSave = useCallback(async (values: UserAttributeUpdateArgs[]) => {
    updateProfileAttributeMutation
      .mutateAsync({
        data: values.map((value) => ({
          data: value.payload,
          version: 100, // value.version,
          id: value.id,
        })),
      })
      .then((res) => {
        const { concurrent_modification = [], failed_unknown = [], modified = [] } = res?.data ?? {};

        if (concurrent_modification.length) {
          setConflicts(
            concurrent_modification.reduce(
              (result, item) => {
                result[item.id] = true;
                return result;
              },
              {} as typeof conflicts,
            ),
          );
        }
      });
  }, []);
  const { queueUpdate, flush, isSaving } = useAutoSave<UserAttributeUpdateArgs>(handleSave);

  useEffect(() => {
    if (Array.isArray(userAttributes)) {
      form.reset({
        attrs: userAttributes.reduce(
          (result, item) => {
            const value = readDynamicValue(item.attribute.type, item) ?? getDynamicDefaultValue(item.attribute.type);
            result[item.id] = {
              value,
              attr: item,
            };
            return result;
          },
          {} as ProfileFormData["attrs"],
        ),
      });
    } else {
      form.reset({
        attrs: {},
      });
    }
  }, [userAttributes]);

  //   updateProfileAttributeMutation.mutateAsync({
  //   id: attr.id,
  //   version: attr.version,
  //   payload: getDynamicValueObject(value, attr.attribute.type) as any,
  // });

  const handleUploadImage = (data: FileWithPreview) => {
    if (data.file instanceof File) {
      uploadProfilePictureMutation.mutate(data.file);
    }
  };

  const readCategoryAttributes = (categoryId: string) => {
    const attrs = form.watch("attrs");
    return Object.entries(attrs).filter(([, item]) => item.attr.attribute.categoryId === categoryId);
  };

  const handleCreateAttributes = async (attrIds: string[]) => {
    createUserAttributeMutation
      .mutateAsync({
        ids: attrIds,
        userId: user.id,
      })
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["users", user.id, "attributes"],
        });
        createDialog.closeDialog();
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
          <div className="mt-10 flex justify-end gap-5">
            <Button loading={isSaving} onClick={flush}>
              <FloppyDiskIcon />
              Save
            </Button>
            <Button variant="destructive" onClick={onStopEditing}>
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
                <Button variant="secondary" onClick={createDialog.openDialog}>
                  <PlusIcon />
                  Add attribute
                </Button>
              </div>
              <ul className="mt-5 space-y-4">
                {attrs.length > 0 ? (
                  attrs.map(([attrId, attr]) => (
                    <li key={attrId} className="flex items-center gap-5">
                      <span className="text-sm">{attr.attr.attribute.name}</span>
                      <span className="ml-auto w-full max-w-80">
                        <Controller
                          control={form.control}
                          name={`attrs.${attrId}.value`}
                          render={({ field }) => (
                            <AttributeEditor
                              type={attr.attr.attribute.type}
                              value={field.value}
                              onValueChange={(value) => {
                                queueUpdate({
                                  id: attr.attr.id,
                                  version: attr.attr.version,
                                  payload: getDynamicValueObject(value, attr.attr.attribute.type),
                                });
                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                      </span>
                      <span className="w-20">
                        {conflicts[attr.attr.id] ? (
                          <Badge variant="destructive">
                            <WarningCircleIcon weight="bold" /> Conflict
                          </Badge>
                        ) : null}
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
