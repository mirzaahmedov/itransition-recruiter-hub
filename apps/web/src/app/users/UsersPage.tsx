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
import { Spinner } from "@/components/ui/spinner";

const UsersPage = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [newRole, setNewRole] = useState<UserRole>(UserRole.ADMINISTRATOR);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const selectedCount = countSelectRows(rowSelection);

  const { data: users, isLoading } = useQuery({
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage user accounts and roles</p>
        </div>
        <div className="flex items-center gap-3">
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
        </div>
      </div>

      {selectedCount > 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          <b>{selectedCount}</b> user{selectedCount !== 1 ? "s" : ""} selected
        </p>
      )}

      <div className="rounded-2xl border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <GenericTable instance={table} onRowClick={(row) => navigate(`${row.original.id}/profile`)} />
        )}
      </div>
    </div>
  );
};

export default UsersPage;
