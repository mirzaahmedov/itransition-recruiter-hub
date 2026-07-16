import { useCategories } from "@/app/categories/useCategories";
import { AttributeEditor } from "@/components/AttributeEditor";
import { AttributePicker } from "@/components/AttributePicker/AttributePickerV2";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import { useAuthStore } from "@/store/useAuthStore";
import type { Attribute, User } from "@rh/database/browser";
import { getDynamicDefaultValue, getDynamicValueObject, readDynamicValue } from "@rh/shared/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { createProfileAttribute, fetchUserProfile, updateProfileAttribute, uploadProfilePicture, type UserProfileWithAttributes } from "./api";
import type { ProfileAttributeUpdatePayload } from "@rh/shared";
import type { ProfileAttributeGetPayload } from "@rh/database/models";
import FileUploadAvatar from "@/components/FileUploadAvatar";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fallbackName } from "@/utils/fallbackName";
import { Button } from "@/components/ui/button";
import { PencilSimpleLineIcon, XIcon } from "@phosphor-icons/react";

const ProfileForm: FC<{
  user: User;
  userProfile: UserProfileWithAttributes;
  onStop: VoidFunction;
}> = ({ user, userProfile, onStop }) => {
  const timers = useRef<Record<string, number>>({});

  const form = useForm({
    defaultValues: {
      attrs: {} as Record<string, any>,
    },
  });

  const categories = useCategories();

  const createProfileAttributeMutation = useMutation({
    mutationFn: createProfileAttribute,
  });

  const uploadProfilePictureMutation = useMutation({
    mutationFn: uploadProfilePicture,
  });

  const updateProfileAttributeMutation = useMutation({
    mutationFn: ({ id, version, payload }: { id: string; version: number; payload: ProfileAttributeUpdatePayload }) =>
      updateProfileAttribute(id, version, payload),
  });

  const handleSelectAttribute = (attr: Attribute) => {
    createProfileAttributeMutation
      .mutateAsync({
        attrId: attr.id,
      })
      .then(console.log);
  };

  useEffect(() => {
    if (userProfile.attrs) {
      form.reset({
        attrs: userProfile.attrs.reduce((result, item) => {
          console.log({ item });
          result[item.id] = readDynamicValue(item.attribute.type, item) ?? getDynamicDefaultValue(item.attribute.type);
          return result;
        }, {}),
      });
    } else {
      form.reset({
        attrs: {},
      });
    }
  }, [userProfile]);

  console.log({ values: form.watch("attrs") });

  const handleChangeField = (
    attr: ProfileAttributeGetPayload<{
      include: {
        attribute: true;
      };
    }>,
    value: any,
  ) => {
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
              <h3 className="uppercase text-xs font-semibold text-brand">{category.name}</h3>
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
    </div>
  );
};

export default ProfileForm;
