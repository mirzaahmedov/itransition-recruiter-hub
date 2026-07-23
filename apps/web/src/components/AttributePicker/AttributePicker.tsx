import { fetchSearchAttributes } from "@/components/AttributePicker/api";
import { GenericTable } from "@/components/generic-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogFooter, DialogHeader, DialogPanel, DialogPopup, DialogTitle } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCategoryStore } from "@/store/useCategoryStore";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import type { Attribute } from "@rh/database/browser";
import { useMutation } from "@tanstack/react-query";
import { getCoreRowModel, getGroupedRowModel, useReactTable, type ColumnDef, type RowSelectionState, type Updater } from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState, type FC } from "react";

const attrColumns: ColumnDef<Attribute>[] = [
  {
    id: "id",
    header: ({ table }) => (
      <Checkbox
        name="selectAll"
        id="selectAll"
        className="checkbox"
        indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        name="selectAll"
        id="selectAll"
        className="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ getValue }) => <Badge variant="info">{getValue<string>()}</Badge>,
  },
];

const valueOrAll = (value: string) => (value !== "all" ? value : undefined);

export const AttributePicker: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (values: string[], data: Attribute[]) => Promise<void>;
  disabledRows?: Record<string, boolean>;
}> = ({ open, onOpenChange, onSelect, disabledRows = {} }) => {
  const timerRef = useRef<NodeJS.Timeout>(null);

  console.log({ disabledRows });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [rowSelectionData, setRowSelectionData] = useState<Record<string, Attribute>>({});
  const [inputValue, setInputValue] = useState("");
  const [rowData, setRowData] = useState<Attribute[]>([]);
  const [categoryId, setCategoryId] = useState(["all"]);

  const categories = useCategoryStore((store) => store.categories);

  const handleRowSelection = useCallback(
    (updater: Updater<RowSelectionState>) => {
      setRowSelection((prevState) => {
        const newSelection = typeof updater === "function" ? updater(prevState) : updater;

        setRowSelectionData((prevData) => {
          const newData = { ...prevData };

          rowData.forEach((row) => {
            if (newSelection[row.id]) {
              newData[row.id] = row;
            } else {
              delete newData[row.id];
            }
          });

          return newData;
        });
        return newSelection;
      });
    },
    [rowData],
  );

  const table = useReactTable({
    columns: attrColumns,
    data: rowData,
    state: {
      rowSelection,
    },
    getRowId: (row) => row.id,
    enableRowSelection(row) {
      if (disabledRows[row.id]) {
        return false;
      }
      return true;
    },
    onRowSelectionChange: handleRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  });

  const searchAttributeMutation = useMutation({
    mutationFn: fetchSearchAttributes,
  });

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const timeoutId = setTimeout(() => {
      searchAttributeMutation
        .mutateAsync({
          q: inputValue,
          categoryId: valueOrAll(categoryId[0]),
        })
        .then((res) => setRowData(res.data ?? []));
    }, 500);
    timerRef.current = timeoutId;

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue]);

  const handleSelected = () => {
    onSelect(Object.keys(rowSelection), Object.values(rowSelectionData)).then(() => {
      setCategoryId(["all"]);
      setRowSelection({});
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="w-full max-w-6xl min-h-150">
        <DialogHeader>
          <DialogTitle>Find attributes</DialogTitle>
        </DialogHeader>
        <DialogPanel className="flex flex-col gap-5">
          <InputGroup className="max-w-xs">
            <InputGroupAddon>
              <MagnifyingGlassIcon />
            </InputGroupAddon>
            <InputGroupInput value={inputValue} onValueChange={setInputValue} />
          </InputGroup>
          <ToggleGroup
            value={categoryId}
            onValueChange={(values) => {
              searchAttributeMutation
                .mutateAsync({
                  q: inputValue,
                  categoryId: valueOrAll(values[0]),
                })
                .then((res) => setRowData(res.data ?? []));
              setCategoryId(values);
            }}
            className="flex flex-wrap"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            {categories.map((category) => (
              <ToggleGroupItem key={category.id} size="sm" value={category.id}>
                <span className="text-xs">{category.name}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div className="flex-1">
            {searchAttributeMutation.isPending ? (
              <div className="h-full grid place-items-center">
                <Spinner />
              </div>
            ) : (
              <GenericTable table={table} />
            )}
          </div>
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Close</DialogClose>
          <Button onClick={handleSelected}>Select</Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
};
