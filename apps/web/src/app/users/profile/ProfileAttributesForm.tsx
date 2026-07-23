import { AttributeEditor } from "@/components/AttributeEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDialogState } from "@/hooks/use-dialog-state";
import { useCategoryStore } from "@/store/useCategoryStore";
import { PlusIcon, WarningCircleIcon } from "@phosphor-icons/react";
import type { User } from "@rh/database/browser";
import type { UpdateUserProfileAttributePayload } from "@rh/shared/schemas";
import { getDynamicDefaultValue, getDynamicValueObject, readDynamicValue } from "@rh/shared/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { AttributePicker } from "@/components/AttributePicker/AttributePicker";
import { bulkUpdateProfileAttributes, createBulkUserAttributes, type BulkUpdateUserAttributeArgs, type UserAttributeWithJoins } from "./api";
import { useAutoSave } from "./useAutoSave";

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

const ProfileAttibutesForm: FC<{
  user: User;
  userAttributes: UserAttributeWithJoins[];
}> = ({ user, userAttributes }) => {
  const queryClient = useQueryClient();

  const [conflicts, setConflicts] = useState<Record<string, boolean>>({});
  const [categoryId, setCategoryId] = useState<string>();

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
        const { concurrent_modification = [], modified } = res?.data ?? {};

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

        modified.forEach((item) => {
          if (form.getValues(`attrs.${item.id}.attr.version`) < item.version) {
            form.setValue(`attrs.${item.id}.attr.version`, item.version);
          }
        });
      });
  }, []);
  const { queueUpdate, flush } = useAutoSave<UserAttributeUpdateArgs>(handleSave);

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

  const readCategoryAttributes = (categoryId: string) => {
    const attrs = form.watch("attrs");
    return Object.entries(attrs).filter(([, item]) => item.attr.attribute.categoryId === categoryId);
  };

  const handleCreateAttributes = async (attrIds: string[]) => {
    await createUserAttributeMutation.mutateAsync({
      ids: attrIds,
      userId: user.id,
    });

    queryClient.invalidateQueries({
      queryKey: ["users", user.id, "attributes"],
    });
    createDialog.closeDialog();
  };

  const disabledRows = useMemo(() => {
    return userAttributes.reduce(
      (result, item) => {
        result[item.attributeId] = true;
        return result;
      },
      {} as Record<string, boolean>,
    );
  }, [userAttributes]);

  return (
    <>
      <div className="mt-8 space-y-6">
        {categories?.map((category) => {
          const attrs = readCategoryAttributes(category.id);
          return (
            <div key={category.id} className="rounded-2xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{category.name}</h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      createDialog.openDialog();
                      setCategoryId(category.id);
                    }}
                    className="-my-2"
                  >
                    <PlusIcon />
                    Add
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                {attrs.length > 0 ? (
                  <ul className="space-y-3">
                    {attrs.map(([attrId, attr]) => (
                      <li key={attrId} className="flex items-start justify-between gap-10">
                        <div className="flex items-end w-full max-w-40 shrink-0 gap-4">
                          <span className="text-sm text-muted-foreground">{attr.attr.attribute.name}</span>
                          <span className="flex-1 border-b border-dotted border-border" />
                        </div>
                        <span className="flex-1 w-full ">
                          <span className="max-w-100">
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
                                  onBlur={() => {
                                    flush();
                                    field.onBlur();
                                  }}
                                  choices={(attr.attr.attribute as any).choices ?? []}
                                />
                              )}
                            />
                          </span>
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

      <AttributePicker
        open={createDialog.open}
        onOpenChange={createDialog.setOpen}
        onSelect={handleCreateAttributes}
        disabledRows={disabledRows}
        initialCategoryId={categoryId}
      />
    </>
  );
};

export default ProfileAttibutesForm;
