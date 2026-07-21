import { Switch } from "@/components/ui/switch";
import { AttributeType, type UserAttribute } from "@rh/database/browser";
import { format } from "date-fns";
import Markdown from "react-markdown";

export function renderDynamicValue(type: AttributeType, record: UserAttribute): any {
  switch (type) {
    case AttributeType.NUMERIC:
      return Intl.NumberFormat().format(record.numberValue ?? 0);
    case AttributeType.BOOLEAN:
      return <Switch checked={Boolean(record.booleanValue)} readOnly />;
    case AttributeType.CHOICE:
      return (record as any).choice?.value ?? record.choiceId ?? "";
    case AttributeType.DATE:
      return record.dateValue ? format(new Date(record.dateValue), "PPP") : "";
    case AttributeType.DATEPERIOD:
      return `${record.startDateValue ? format(new Date(record.startDateValue), "PPP") : ""} - ${record.endDateValue ? format(new Date(record.endDateValue), "PPP") : ""}`;
    case AttributeType.IMAGE:
      return record.textValue ? <img src={record.textValue} alt="" className="max-h-32 rounded-lg object-cover" /> : "";
    case AttributeType.MARKDOWN:
      return record.textValue ? (
        <div className="w-full prose dark:prose-invert prose-strong:text-foreground text-foreground text-sm">
          <Markdown>{record.textValue}</Markdown>
        </div>
      ) : (
        ""
      );
    default:
      return record.textValue;
  }
}
