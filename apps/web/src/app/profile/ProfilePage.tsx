import { useCategories } from "@/app/categories/useCategories";
import { AttributePicker } from "@/components/AttributePicker/AttributePickerV2";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldLabel } from "@/components/ui/field";
import { useAuthStore } from "@/store/useAuthStore";
import type { Attribute, AttributeValue } from "@rh/database/browser";
import { AttributeType } from "@rh/database/enums";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProfileAttribute, fetchProfile } from "./api";
import { AttributeEditor } from "@/components/AttributeEditor";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const ProfilePage = () => {
  const user = useAuthStore((store) => store.user);

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
                          render={({ field }) => <AttributeEditor type={item.attribute.type} value={field.value} onValueChange={field.onChange} />}
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

function getDynamicDefaultValue(type: AttributeType) {
  switch (type) {
    case AttributeType.NUMERIC:
      return 0;
    case AttributeType.BOOLEAN:
      return false;
    case AttributeType.CHOICE:
      return null;
    case AttributeType.DATE:
      return null;
    case AttributeType.DATEPERIOD:
      return [null, null];
    default:
      return "";
  }
}

function readDynamicValue(type: AttributeType, record: AttributeValue): any {
  switch (type) {
    case AttributeType.NUMERIC:
      return record.numberValue;
    case AttributeType.BOOLEAN:
      return record.booleanValue;
    case AttributeType.CHOICE:
      return record.choiceId;
    case AttributeType.DATE:
      return record.dateValue;
    case AttributeType.DATEPERIOD:
      return [record.startDateValue, record.endDateValue];
    default:
      return record.textValue;
  }
}

function getDynamicValueObject(value: any, type: AttributeType): Partial<AttributeValue> {
  switch (type) {
    case AttributeType.NUMERIC:
      return { numberValue: value };
    case AttributeType.BOOLEAN:
      return { booleanValue: value };
    case AttributeType.CHOICE:
      return { choiceId: value };
    case AttributeType.DATE:
      return { dateValue: value };
    case AttributeType.DATEPERIOD:
      return { startDateValue: value[0], endDateValue: value[1] };
    default:
      return { textValue: String(value) };
  }
}

export default ProfilePage;
