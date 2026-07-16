import { AttributeType } from "@rh/database/enums";
import type { FC } from "react";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from "./ui/number-field";

export const AttributeEditor: FC<{
  type: AttributeType;
  value: any;
  onValueChange: (value: any) => void;
}> = ({ type, value, onValueChange }) => {
  switch (type) {
    case AttributeType.NUMERIC:
      return (
        <NumberField value={value} onValueChange={onValueChange} className="w-full max-w-full">
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      );
    case AttributeType.BOOLEAN:
      return <Switch checked={value} onCheckedChange={onValueChange} className="w-full max-w-full" />;
    case AttributeType.DATE:
      return <Input type="date" value={value} onChange={(e) => onValueChange(e.target.value)} className="w-full max-w-full" />;
    case AttributeType.MARKDOWN:
      return <Textarea value={value} onChange={(e) => onValueChange(e.target.value)} className="w-full max-w-full" />;
    case AttributeType.TEXT:
      return <Input value={value} onChange={(e) => onValueChange(e.target.value)} className="w-full max-w-full" />;
    default:
      return <Input value={value} onChange={(e) => onValueChange(e.target.value)} className="w-full max-w-full" />;
  }
};
