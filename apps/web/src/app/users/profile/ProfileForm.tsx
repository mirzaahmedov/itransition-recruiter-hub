import { AttributeEditor } from "@/components/AttributeEditor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDialogState } from "@/hooks/use-dialog-state";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import { useCategoryStore } from "@/store/useCategoryStore";
import { fallbackName } from "@/utils/fallbackName";
import { FloppyDiskIcon, PlusIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import type { User } from "@rh/database/browser";
import type { UpdateUserProfileAttributePayload } from "@rh/shared";
import { getDynamicDefaultValue, getDynamicValueObject, readDynamicValue } from "@rh/shared/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  bulkUpdateProfileAttributes,
  createBulkUserAttributes,
  uploadProfilePicture,
  updateUserProfile,
  type BulkUpdateUserAttributeArgs,
  type UserAttributeWithJoins,
} from "./api";
import { AttributePicker } from "../../../components/AttributePicker/AttributePicker";
import { useAutoSave } from "./useAutoSave";
import { Badge } from "@/components/ui/badge";
import FileUploadAvatar from "@/components/FileUploadAvatar";

interface UserAttributeUpdateArgs {
  id: string;
  version: number;
  payload: UpdateUserProfileAttributePayload;
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

  const [name, setName] = useState(user.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
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

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string }) => updateUserProfile(user.id, data),
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
          version: value.version,
          id: value.id,
        })),
      })
      .then((res) => {
        const { concurrent_modification = [] } = res?.data ?? {};

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

  const handleAvatarUpload = (data: FileWithPreview) => {
    if (data.file instanceof File) {
      uploadProfilePictureMutation.mutate(data.file, {
        onSuccess: (res: any) => {
          if (res?.avatar) {
            setAvatarUrl(res.avatar);
          }
        },
      });
    }
  };

  const handleSaveProfile = async () => {
    const nameChanged = name !== (user.name ?? "");
    if (nameChanged) {
      await updateProfileMutation.mutateAsync({ name });
    }
    await flush();
    queryClient.invalidateQueries({ queryKey: ["users", user.id] });
    onStopEditing();
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
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="h-32 bg-linear-to-br from-brand/20 via-brand/10 to-transparent" />
        <div className="px-8 pb-8">
          <div className="flex items-end gap-5 -mt-12">
            <FileUploadAvatar onSelect={handleAvatarUpload} isPending={uploadProfilePictureMutation.isPending}>
              <Avatar className="size-24 ring-4 ring-card">
                <AvatarImage src={avatarUrl ?? undefined} alt={name ?? "Avatar"} />
                <AvatarFallback className="text-3xl">{fallbackName(name || "User")}</AvatarFallback>
              </Avatar>
            </FileUploadAvatar>
            <div className="flex-1 pb-1 space-y-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold h-auto py-0 px-0 border-0 border-b border-transparent focus:border-border rounded-none shadow-none bg-transparent"
                placeholder="Your name"
              />
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <Button loading={isSaving || updateProfileMutation.isPending} onClick={handleSaveProfile}>
                <FloppyDiskIcon />
                Save
              </Button>
              <Button variant="ghost" onClick={onStopEditing}>
                <XIcon />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {categories?.map((category) => {
          const attrs = readCategoryAttributes(category.id);
          return (
            <div key={category.id} className="rounded-2xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{category.name}</h3>
                <Button variant="secondary" size="sm" onClick={createDialog.openDialog}>
                  <PlusIcon />
                  Add
                </Button>
              </div>
              <div className="mt-4">
                {attrs.length > 0 ? (
                  <ul className="space-y-3">
                    {attrs.map(([attrId, attr]) => (
                      <li key={attrId} className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground shrink-0 w-32">{attr.attr.attribute.name}</span>
                        <span className="flex-1 max-w-80">
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
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No attributes added yet</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AttributePicker open={createDialog.open} onOpenChange={createDialog.setOpen} onSelect={handleCreateAttributes} />
    </div>
  );
};

export default ProfileForm;
