import { AttributeEditor } from "@/components/attribute-editor";
import { AttributePicker } from "@/components/attribute-picker/attribute-picker";
import { AttributeConflictResolve } from "@/components/attribute/attribute-conflict-resolve";
import { Button } from "@/components/ui/button";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useDialogState } from "@/hooks/use-dialog-state";
import { useCategoryStore } from "@/store/use-category-store";
import { PlusIcon, WarningCircleIcon } from "@phosphor-icons/react";
import type { User } from "@rh/database/browser";
import type { BulkUpdateUserProfileAttributePayload, UpdateUserProfileAttributePayload } from "@rh/shared/schemas";
import { getDynamicDefaultValue, getDynamicValueObject, readDynamicValue } from "@rh/shared/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useImperativeHandle, useMemo, useState, type FC, type RefObject } from "react";
import { Controller, useForm } from "react-hook-form";
import { bulkUpdateProfileAttributes, createBulkUserAttributes, type BulkUpdateUserAttributeArgs, type UserAttributeWithJoins } from "./api";
import { Badge } from "@/components/ui/badge";

export interface ProfileAttibutesFormHandlers {
  flush: () => Promise<void>;
}

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
  methods: RefObject<ProfileAttibutesFormHandlers>;
  userAttributes: UserAttributeWithJoins[];
}> = ({ methods, user, userAttributes }) => {
  const queryClient = useQueryClient();

  const [conflicts, setConflicts] = useState<Record<string, BulkUpdateUserProfileAttributePayload[number]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    await updateProfileAttributeMutation
      .mutateAsync({
        data: values.map((value) => ({
          data: value.payload,
          version: value.version,
          id: value.id,
        })),
      })
      .then((res) => {
        const { concurrent_modification = [], modified, failed_unknown } = res?.data ?? {};

        if (concurrent_modification.length) {
          setConflicts((prevValues) => {
            const newValues = { ...prevValues };

            modified.forEach((modified) => {
              if (newValues[modified.id]) {
                delete newValues[modified.id];
              }
            });

            failed_unknown.forEach((fail) => {
              if (newValues[fail.id]) {
                delete newValues[fail.id];
              }
            });

            concurrent_modification.forEach((failModif) => {
              newValues[failModif.id] = failModif;
            });

            return newValues;
          });
        }

        if (failed_unknown.length) {
          setErrors((prevValues) => {
            const newValues = { ...prevValues };

            failed_unknown.forEach((fail) => {
              newValues[fail.id] = "Unknown error";
            });

            return newValues;
          });
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

  useImperativeHandle(
    methods,
    () => ({
      async flush() {
        await flush();
      },
    }),
    [],
  );

  return (
    <>
      <div className="mt-8 space-y-6">
        {categories?.map((category) => {
          const attrs = readCategoryAttributes(category.id);
          return (
            <div key={category.id} className="rounded-2xl border bg-card p-3 md:p-6">
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
                    {attrs.map(([attrId, { attr }]) => (
                      <li key={attrId} className="flex flex-col gap-2 rounded-lg py-2 md:flex-row md:items-start md:gap-4">
                        <div className="flex items-center gap-2 md:w-48 md:shrink-0">
                          <span className="text-sm font-medium text-muted-foreground">{attr.attribute.name}</span>
                          <span className="hidden flex-1 border-b border-dotted border-border md:block mt-2" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <Controller
                            control={form.control}
                            name={`attrs.${attrId}.value`}
                            render={({ field }) => (
                              <AttributeEditor
                                type={attr.attribute.type}
                                value={field.value}
                                onValueChange={(value) => {
                                  queueUpdate({
                                    id: attr.id,
                                    version: attr.version,
                                    payload: getDynamicValueObject(value, attr.attribute.type),
                                  });
                                  field.onChange(value);
                                }}
                                onBlur={() => {
                                  flush();
                                  field.onBlur();
                                }}
                                choices={(attr.attribute as any).choices ?? []}
                              />
                            )}
                          />
                        </div>

                        <div className="flex items-center md:w-28 md:shrink-0 md:justify-end md:self-center">
                          {errors[attr.id] ? (
                            <Badge variant="destructive">
                              <WarningCircleIcon />
                              {errors[attr.id]}
                            </Badge>
                          ) : null}
                          {conflicts[attr.id] ? (
                            <AttributeConflictResolve
                              userId={user.id}
                              userAttributeId={attr.id}
                              conflict={conflicts[attr.id]}
                              form={form}
                              onSave={handleSave}
                              onResolve={() =>
                                setConflicts((prev) => {
                                  const newValues = { ...prev };
                                  delete newValues[attr.id];
                                  return newValues;
                                })
                              }
                            />
                          ) : null}
                        </div>
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
