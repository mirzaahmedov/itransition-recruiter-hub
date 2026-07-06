import { AttributeType } from "@rh/database/enums";

export const AttributeTypeSelectItems = [
  { label: "Text", value: AttributeType.TEXT },
  { label: "Markdown", value: AttributeType.MARKDOWN },
  { label: "Numeric", value: AttributeType.NUMERIC },
  { label: "Image", value: AttributeType.IMAGE },
  { label: "Boolean", value: AttributeType.BOOLEAN },
  { label: "Choice", value: AttributeType.CHOICE },
  { label: "Date", value: AttributeType.DATE },
  { label: "Date Period", value: AttributeType.DATEPERIOD },
];
