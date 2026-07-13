import { useCategories } from "@/app/categories/useCategories";
import { AttributeEditor } from "@/components/AttributeEditor";
import { AttributePicker } from "@/components/AttributePicker/AttributePickerV2";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import { useAuthStore } from "@/store/useAuthStore";
import type { Attribute, AttributeValue } from "@rh/database/browser";
import { getDynamicDefaultValue, getDynamicValueObject, readDynamicValue } from "@rh/shared/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { createProfileAttribute, fetchProfile, updateProfileAttribute } from "./api";
import type { ProfileAttributeUpdatePayload } from "@rh/shared";
import type { AttributeValueGetPayload } from "@rh/database/models";

const ProfilePage = () => {
  const user = useAuthStore((store) => store.user);

  const timers = useRef<Record<string, number>>({});

  const form = useForm({
    defaultValues: {
      attrs: {} as Record<string, any>,
    },
  });

  const { data: profileData } = useQuery({
    queryKey: ["user/profile", user?.id],
    queryFn: fetchProfile,
  });

  const categories = useCategories();

  const createProfileAttributeMutation = useMutation({
    mutationFn: createProfileAttribute,
  });

  const updateProfileAttributeMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProfileAttributeUpdatePayload }) => updateProfileAttribute(id, payload),
  });

  const handleSelectAttribute = (attr: Attribute) => {
    createProfileAttributeMutation
      .mutateAsync({
        attrId: attr.id,
      })
      .then(console.log);
  };

  useEffect(() => {
    if (profileData?.data?.attrs) {
      form.reset({
        attrs: profileData.data.attrs.reduce((result, item) => {
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
  }, [profileData]);

  console.log({ values: form.watch("attrs") });

  const handleChangeField = (
    attr: AttributeValueGetPayload<{
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
        payload: getDynamicValueObject(value, attr.attribute.type) as any,
      });
    }, 1000);

    timers.current[attr.id] = timeoutId;
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden p-5">
      <AttributePicker onSelect={handleSelectAttribute} />

      <Accordion multiple>
        {categories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger>{category.name}</AccordionTrigger>
            <AccordionPanel>
              {profileData?.data?.attrs
                .filter((attr) => attr.attribute.categoryId === category.id)
                .map((item) => (
                  <li key={item.id}>
                    <div className="p-5 grid grid-cols-2">
                      <span>{item.attribute.name}</span>
                      <div>
                        <Controller
                          control={form.control}
                          name={`attrs.${item.id}`}
                          render={({ field }) => (
                            <AttributeEditor
                              type={item.attribute.type}
                              value={field.value}
                              onValueChange={(value) => {
                                handleChangeField(item, value);
                                field.onChange(value);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </li>
                ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ProfilePage;
