import { AttributeValue } from "@rh/database/browser";
import { AttributeType } from "@rh/database/enums";

export function getDynamicDefaultValue(type: AttributeType) {
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

export function readDynamicValue(type: AttributeType, record: AttributeValue): any {
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

export function getDynamicValueObject(value: any, type: AttributeType): Partial<AttributeValue> {
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
