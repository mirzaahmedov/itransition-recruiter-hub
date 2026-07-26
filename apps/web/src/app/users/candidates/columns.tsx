import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fallbackName } from "@/utils/fallbackName";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { CandidateUser } from "./api";
import { Badge } from "@/components/ui/badge";
import { ReadCvLogoIcon } from "@phosphor-icons/react";
import type { Resume } from "@rh/database/browser";

export const candidateColumns: ColumnDef<CandidateUser>[] = [
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
    accessorKey: "resumes",
    header: "Resumes",
    cell: ({ getValue }) => (
      <Badge variant="info" size="lg">
        <ReadCvLogoIcon className="size-4" weight="bold" />
        {getValue<Resume[]>()?.length}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ getValue }) => {
      return format(new Date(getValue<string>()), "PPPP");
    },
  },
];
