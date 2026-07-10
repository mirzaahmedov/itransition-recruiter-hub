import { AttributePicker } from "@/components/AttributePicker/AttributePicker";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { AttributeWithChoices } from "../attributes/api";
import { createProfileAttributeValue, fetchProfile } from "./api";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";
import { AttributeEditor } from "@/components/AttributeEditor";
import { AttributeType } from "@rh/database/enums";
import type { Attribute, AttributeValue } from "@rh/database/browser";

const ProfilePage = () => {
  const user = useAuthStore((store) => store.user);

  const [value, setValue] = useState<unknown>();
  const [attrData, setAttrData] = useState<AttributeWithChoices>();

  const { data: profileData } = useQuery({
    queryKey: ["user/profile", user?.id],
    queryFn: fetchProfile,
  });

  const createProfileAttributeMutation = useMutation({
    mutationFn: createProfileAttributeValue,
  });

  const handleSelectAttribute = (attr: Attribute) => {
    setValue(getDynamicDefaultValue(attr.type));
    setAttrData(attr);
  };

  return (
    <div>
      <Field>
        <FieldLabel>Attribute</FieldLabel>
        <AttributePicker onSelect={handleSelectAttribute} />
      </Field>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          if (profileData?.data) {
            createProfileAttributeMutation.mutate({
              attributeId: attrData.id,
              profileId: profileData.data.id,
              ...getDynamicValueObject(value, attrData.type),
            });
          }
        }}
      >
        {attrData ? (
          <div className="flex items-end gap-5">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input readOnly value={attrData.name} />
            </Field>
            <Field>
              <FieldLabel>Type</FieldLabel>
              <Input readOnly value={attrData.type} />
            </Field>
            <Field>
              <FieldLabel>Type</FieldLabel>
              <AttributeEditor value={value} onValueChange={setValue} type={attrData.type} />
            </Field>
            <Button>
              <PlusIcon />
              Add
            </Button>
          </div>
        ) : null}
      </Form>

      {profileData?.data?.attrs?.map((attr) => (
        <div key={attr.id}>{attr.id}</div>
      ))}
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
