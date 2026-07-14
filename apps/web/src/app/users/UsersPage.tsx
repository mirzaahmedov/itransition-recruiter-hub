import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bulkUpdateRoles, fetchUsers } from "./api";
import { getCoreRowModel, useReactTable, type RowSelectionState } from "@tanstack/react-table";
import { UserRole, type User } from "@rh/database/browser";
import { useState } from "react";
import { ShieldCheckIcon } from "@phosphor-icons/react";
import { countSelectRows, rowSelectionToArray } from "@/lib/table/utils";
import toast from "react-hot-toast";
import { GenericTable } from "@/components/GenericTable/GenericTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { fallbackName } from "@/utils/fallbackName";

const UsersPage = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [newRole, setNewRole] = useState<UserRole>(UserRole.ADMINISTRATOR);

  const queryClient = useQueryClient();
  const selectedCount = countSelectRows(rowSelection);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const updateUserRolesMutation = useMutation({
    mutationFn: (role: UserRole) => bulkUpdateRoles(rowSelectionToArray(rowSelection), role),
  });

  const table = useReactTable<User>({
    getCoreRowModel: getCoreRowModel(),
    data: users?.data ?? [],
    state: {
      rowSelection,
    },
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
    columns: [
      {
        id: "id",
        header: ({ table }) => (
          <Checkbox
            name="selectAll"
            id="selectAll"
            className="checkbox"
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
    ],
  });

  console.log({ rowSelection, ids: rowSelectionToArray(rowSelection) });

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-base-content/10 flex items-center gap-5">
        <Popover>
          <PopoverTrigger
            render={
              <Button disabled={!selectedCount}>
                <ShieldCheckIcon className="size-5" />
                Assign new role
              </Button>
            }
          ></PopoverTrigger>
          <PopoverPopup>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                updateUserRolesMutation.mutate(newRole, {
                  onSuccess() {
                    toast.success(`Updated ${selectedCount} users`);
                    setRowSelection({});
                    queryClient.invalidateQueries({
                      queryKey: ["users"],
                    });
                  },
                  onError() {
                    toast.error(`Update failed`);
                  },
                });
              }}
              className="w-48 flex flex-col items-start gap-5"
            >
              <fieldset className="fieldset">
                <legend className="fieldset-legend pt-0">New role</legend>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={UserRole.ADMINISTRATOR}
                    value={UserRole.ADMINISTRATOR}
                    checked={newRole === UserRole.ADMINISTRATOR}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                  />
                  <label htmlFor={UserRole.ADMINISTRATOR}>Administrator</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={UserRole.CANDIDATE}
                    value={UserRole.CANDIDATE}
                    checked={newRole === UserRole.CANDIDATE}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                  />
                  <label htmlFor={UserRole.CANDIDATE}>Candidate</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={UserRole.RECRUITER}
                    value={UserRole.RECRUITER}
                    checked={newRole === UserRole.RECRUITER}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                  />
                  <label htmlFor={UserRole.RECRUITER}>Recruiter</label>
                </div>
              </fieldset>

              <Button type="submit" className="self-end">
                Change role
              </Button>
            </form>
          </PopoverPopup>
        </Popover>

        <p>
          <b>{selectedCount}</b> user selected
        </p>
      </div>
      <div className="flex-1">
        <GenericTable instance={table} />
      </div>
    </div>
  );
};

export default UsersPage;
