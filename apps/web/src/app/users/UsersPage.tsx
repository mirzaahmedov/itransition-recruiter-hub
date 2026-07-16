import { GenericTable } from "@/components/GenericTable/GenericTable";
import { Button } from "@/components/ui/button";
import { Popover, PopoverPopup, PopoverTrigger } from "@/components/ui/popover";
import { countSelectRows, rowDataWithFallback, rowSelectionToArray } from "@/lib/table/utils";
import { ShieldCheckIcon } from "@phosphor-icons/react";
import { UserRole, type User } from "@rh/database/browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable, type RowSelectionState } from "@tanstack/react-table";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { bulkUpdateRoles, fetchUsers } from "./api";
import { userColumns } from "./columns";

const UsersPage = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [newRole, setNewRole] = useState<UserRole>(UserRole.ADMINISTRATOR);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const selectedCount = countSelectRows(rowSelection);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const rowData = rowDataWithFallback(users?.data);

  const updateUserRolesMutation = useMutation({
    mutationFn: (role: UserRole) => bulkUpdateRoles(rowSelectionToArray(rowSelection), role),
  });

  const table = useReactTable<User>({
    getCoreRowModel: getCoreRowModel(),
    data: rowData,
    state: {
      rowSelection,
    },
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
    columns: userColumns,
  });

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
        <GenericTable instance={table} onRowClick={(row) => navigate(`${row.original.id}/profile`)} />
      </div>
    </div>
  );
};

export default UsersPage;
