import { cn } from "@/lib/utils";
import { AttributeType } from "@rh/database/enums";
import type { AttributeChoice } from "@rh/database/browser";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMemo, type FC } from "react";
import { MDXEditor } from "./mdx-editor";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from "./ui/number-field";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";

export const AttributeEditor: FC<{
  type: AttributeType;
  value: any;
  onValueChange: (value: any) => void;
  onBlur: VoidFunction;
  choices?: AttributeChoice[];
  onImageUpload?: (file: File) => void;
}> = ({ type, value, onValueChange, onBlur, choices, onImageUpload }) => {
  const choiceOptions = useMemo(
    () =>
      (choices ?? []).map((choice) => ({
        value: choice.id,
        label: choice.value,
      })),
    [choices],
  );

  switch (type) {
    case AttributeType.NUMERIC:
      return (
        <NumberField value={value} onValueChange={onValueChange} onBlur={onBlur} className="w-full max-w-full">
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      );
    case AttributeType.BOOLEAN:
      return <Switch checked={value} onCheckedChange={onValueChange} onBlur={onBlur} />;
    case AttributeType.DATE:
      return <DatePicker value={value} onChange={onValueChange} onBlur={onBlur} />;
    case AttributeType.DATEPERIOD:
      return (
        <div className="flex items-center gap-2">
          <DatePicker value={value?.[0] ?? null} onChange={(v) => onValueChange([v, value?.[1] ?? null])} onBlur={onBlur} />
          <span className="text-muted-foreground">—</span>
          <DatePicker value={value?.[1] ?? null} onChange={(v) => onValueChange([value?.[0] ?? null, v])} onBlur={onBlur} />
        </div>
      );
    case AttributeType.CHOICE:
      return (
        <Select value={value ?? ""} onValueChange={onValueChange} items={choiceOptions}>
          <SelectTrigger onBlur={onBlur}>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectPopup>
            {choiceOptions.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      );
    case AttributeType.MARKDOWN:
      return <MDXEditor value={value ?? ""} onChange={onValueChange} onBlur={onBlur} />;
    case AttributeType.IMAGE:
      return <ImageUpload value={value} onChange={onValueChange} onUpload={onImageUpload} />;
    case AttributeType.TEXT:
      return <Input value={value} onChange={(e) => onValueChange(e.target.value)} className="w-full max-w-full" onBlur={onBlur} />;
    default:
      return <Input value={value} onChange={(e) => onValueChange(e.target.value)} className="w-full max-w-full" onBlur={onBlur} />;
  }
};

const DatePicker: FC<{ value: string | null; onChange: (v: string | null) => void; onBlur: VoidFunction }> = ({ value, onChange, onBlur }) => {
  const date = value ? new Date(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" className={cn("w-44 justify-start text-left font-normal", !date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 size-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent onBlur={onBlur}>
        <Calendar mode="single" selected={date} onSelect={(d) => onChange(d ? d.toISOString() : null)} autoFocus />
      </PopoverContent>
    </Popover>
  );
};

const ImageUpload: FC<{
  value: string | null;
  onChange: (v: string | null) => void;
  onUpload?: (file: File) => void;
}> = ({ value, onChange, onUpload }) => {
  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative size-16 shrink-0">
          <img src={value} alt="Uploaded" className="size-16 rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-1 -right-1 size-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center"
          >
            ×
          </button>
        </div>
      ) : null}
      <Input
        type="file"
        accept="image/*"
        className="w-full max-w-full"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onUpload) {
            onUpload(file);
          }
        }}
      />
    </div>
  );
};
