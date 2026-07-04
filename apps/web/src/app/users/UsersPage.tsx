import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bulkUpdateRoles, fetchUsers } from "./api";
import { getCoreRowModel, useReactTable, type RowSelectionState } from "@tanstack/react-table";
import { UserRole, type User } from "@/types/prisma/browser";
import { useState } from "react";
import { ShieldCheckIcon } from "@phosphor-icons/react";
import { FloatingPopover } from "@/components/FloatingPopover";
import { countSelectRows, rowSelectionToArray } from "@/lib/table/utils";
import toast from "react-hot-toast";
import { GenericTable } from "@/components/GenericTable/GenericTable";

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
          <input
            type="checkbox"
            name="selectAll"
            id="selectAll"
            className="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            name="selectAll"
            id="selectAll"
            className="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
          />
        ),
      },
      {
        id: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-5">
            <div className="avatar">
              <div className="mask mask-squircle h-12 w-12">
                <img src={row.original.avatar ?? ""} alt={row.original.name ?? "Profile picture"} />
              </div>
            </div>
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
        <FloatingPopover
          placement="bottom-start"
          render={() => (
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

              <button type="submit" className="btn btn-primary self-end">
                Change role
              </button>
            </form>
          )}
        >
          <button disabled={!selectedCount} className="btn btn-primary">
            <ShieldCheckIcon className="size-5" />
            Assign new role
          </button>
        </FloatingPopover>
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
