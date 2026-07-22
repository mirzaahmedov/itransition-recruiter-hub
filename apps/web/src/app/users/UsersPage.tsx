import { GenericTable } from "@/components/GenericTable/GenericTable";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { countSelectRows, rowDataWithFallback, rowSelectionToArray } from "@/lib/table/utils";
import { TrashIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import { UserRole, type User } from "@rh/database/browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable, type RowSelectionState } from "@tanstack/react-table";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { bulkDeleteUsers, bulkUpdateRoles, fetchUsers } from "./api";
import { userColumns } from "./columns";
import { Spinner } from "@/components/ui/spinner";

const roleOptions = [
  { value: UserRole.ADMINISTRATOR, label: "Administrator" },
  { value: UserRole.CANDIDATE, label: "Candidate" },
  { value: UserRole.RECRUITER, label: "Recruiter" },
];

const UsersPage = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [newRole, setNewRole] = useState<string>(UserRole.ADMINISTRATOR);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const selectedCount = countSelectRows(rowSelection);
  const selectedIds = rowSelectionToArray(rowSelection);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const rowData = rowDataWithFallback(users?.data);

  const updateUserRolesMutation = useMutation({
    mutationFn: (role: UserRole) => bulkUpdateRoles(selectedIds, role),
    onSuccess() {
      toast.success(`Updated ${selectedCount} users`);
      setRowSelection({});
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError() {
      toast.error("Update failed");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: () => bulkDeleteUsers(selectedIds),
    onSuccess() {
      toast.success(`Deleted ${selectedCount} users`);
      setRowSelection({});
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError() {
      toast.error("Delete failed");
    },
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
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-3 mb-4 rounded-xl border bg-card p-3">
          <span className="text-sm text-muted-foreground mr-1">
            <b>{selectedCount}</b> user{selectedCount !== 1 ? "s" : ""} selected
          </span>

          <div className="h-5 w-px bg-border" />

          <ShieldCheckIcon className="size-4 text-muted-foreground" />
          <Select value={newRole} onValueChange={(v) => v && setNewRole(v)} items={roleOptions}>
            <SelectTrigger size="sm" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {roleOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>

          <Button
            size="sm"
            loading={updateUserRolesMutation.isPending}
            onClick={() => updateUserRolesMutation.mutate(newRole as UserRole)}
          >
            Update role
          </Button>

          <div className="h-5 w-px bg-border" />

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button size="sm" variant="destructive-outline">
                  <TrashIcon className="size-4" />
                  Delete
                </Button>
              }
            />
            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {selectedCount} user{selectedCount !== 1 ? "s" : ""}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The selected users and all their data will be permanently
                  deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose render={<Button variant="ghost" />}>Cancel</AlertDialogClose>
                <AlertDialogClose
                  render={<Button variant="destructive" loading={bulkDeleteMutation.isPending} />}
                  onClick={() => bulkDeleteMutation.mutate()}
                >
                  Delete
                </AlertDialogClose>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>
        </div>
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
