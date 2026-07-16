import { Checkbox } from "@/components/ui/checkbox";
import { AttributeType, type ProfileAttribute } from "@rh/database/browser";

export function renderDynamicValue(type: AttributeType, record: ProfileAttribute): any {
  switch (type) {
    case AttributeType.NUMERIC:
      return Intl.NumberFormat().format(record.numberValue ?? 0);
    case AttributeType.BOOLEAN:
      return <Checkbox checked={Boolean(record.booleanValue)} />;
    case AttributeType.CHOICE:
      return record.choiceId;
    case AttributeType.DATE:
      return record.dateValue ? Intl.DateTimeFormat().format(new Date(record.dateValue)) : "";
    case AttributeType.DATEPERIOD:
      return `${record.startDateValue ? Intl.DateTimeFormat().format(new Date(record.startDateValue)) : ""} - ${record.endDateValue ? Intl.DateTimeFormat().format(record.endDateValue) : ""}`;
    default:
      return record.textValue;
  }
}
