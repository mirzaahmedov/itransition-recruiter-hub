import { useCategories } from "@/app/categories/useCategories";
import { AttributePicker } from "@/components/AttributePicker/AttributePickerV2";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import { Field, FieldLabel } from "@/components/ui/field";
import { useAuthStore } from "@/store/useAuthStore";
import type { Attribute, AttributeValue } from "@rh/database/browser";
import { AttributeType } from "@rh/database/enums";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProfileAttribute, fetchProfile } from "./api";

const ProfilePage = () => {
  const user = useAuthStore((store) => store.user);

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

  return (
    <div>
      <Field>
        <FieldLabel>Attribute</FieldLabel>
        <AttributePicker onSelect={handleSelectAttribute} />
      </Field>

      <Accordion className="w-full" multiple>
        {categories.map((category) => (
          <AccordionItem key={category.id} value="item-1">
            <AccordionTrigger>{category.name}</AccordionTrigger>
            <AccordionPanel>
              {profileData?.data?.attrs
                .filter((attr) => attr.attribute.categoryId === category.id)
                .map((attr) => (
                  <li>{attr.attribute.name}</li>
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
