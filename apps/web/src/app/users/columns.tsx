import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { fallbackName } from "@/utils/fallbackName";
import type { User } from "@rh/database/browser";
import type { ColumnDef } from "@tanstack/react-table";

export const userColumns: ColumnDef<User>[] = [
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
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  },
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-5">
        <Avatar>
          <AvatarImage alt={row.original.name ?? "User avatar"} src={row.original.avatar ?? undefined} />
          <AvatarFallback>{fallbackName(row.original.name ?? "")}</AvatarFallback>
        </Avatar>
        <b>{row.original.name}</b>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
