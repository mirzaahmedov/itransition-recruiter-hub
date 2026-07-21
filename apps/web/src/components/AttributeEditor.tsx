import { AttributeType, type AttributeChoice } from "@rh/database/enums";
import type { FC } from "react";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput } from "./ui/number-field";
import { Select, SelectButton, SelectContent, SelectItem, SelectPopup, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MDXEditor } from "./mdx-editor";

export const AttributeEditor: FC<{
  type: AttributeType;
  value: any;
  onValueChange: (value: any) => void;
  choices?: AttributeChoice[];
  onImageUpload?: (file: File) => void;
}> = ({ type, value, onValueChange, choices, onImageUpload }) => {
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
      return <DatePicker value={value} onChange={onValueChange} />;
    case AttributeType.DATEPERIOD:
      return (
        <div className="flex items-center gap-2">
          <DatePicker value={value?.[0] ?? null} onChange={(v) => onValueChange([v, value?.[1] ?? null])} />
          <span className="text-muted-foreground">—</span>
          <DatePicker value={value?.[1] ?? null} onChange={(v) => onValueChange([value?.[0] ?? null, v])} />
        </div>
      );
    case AttributeType.CHOICE:
      return (
        <Select value={value ?? ""} onValueChange={onValueChange}>
          <SelectButton>
            <SelectValue placeholder="Select..." />
          </SelectButton>
          <SelectPopup>
            {(choices ?? []).map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.value}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      );
    case AttributeType.MARKDOWN:
      return <MDXEditor value={value ?? ""} onChange={onValueChange} />;
    case AttributeType.IMAGE:
      return <ImageUpload value={value} onChange={onValueChange} onUpload={onImageUpload} />;
    case AttributeType.TEXT:
      return <Input value={value} onChange={(e) => onValueChange(e.target.value)} className="w-full max-w-full" />;
    default:
      return <Input value={value} onChange={(e) => onValueChange(e.target.value)} className="w-full max-w-full" />;
  }
};

const DatePicker: FC<{ value: string | null; onChange: (v: string | null) => void }> = ({ value, onChange }) => {
  const date = value ? new Date(value) : undefined;

  return (
    <Popover>
      <PopoverTrigger render={<div />}>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => onChange(d ? d.toISOString() : null)}
          initialFocus
        />
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
        className="max-w-40"
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
