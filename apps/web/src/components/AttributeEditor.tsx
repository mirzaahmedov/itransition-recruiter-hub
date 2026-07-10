import { AttributeType } from "@rh/database/enums";
import { NumberFormatBase } from "react-number-format";
import type { FC } from "react";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

export const AttributeEditor: FC<{
  type: AttributeType;
  value: any;
  onValueChange: (value: any) => void;
}> = ({ type, value, onValueChange }) => {
  switch (type) {
    case AttributeType.NUMERIC:
      return <NumberFormatBase customInput={Input} value={value} onValueChange={(values) => onValueChange(values.floatValue ?? 0)} />;
    case AttributeType.BOOLEAN:
      return <Switch checked={value} onCheckedChange={onValueChange} />;
    case AttributeType.DATE:
      return <Input type="date" value={value} onChange={(e) => onValueChange(e.target.value)} />;
    case AttributeType.MARKDOWN:
      return <Textarea value={value} onChange={(e) => onValueChange(e.target.value)} />;
    case AttributeType.TEXT:
      return <Input value={value} onChange={(e) => onValueChange(e.target.value)} />;
    default:
      return <Input value={value} onChange={(e) => onValueChange(e.target.value)} />;
  }
};
