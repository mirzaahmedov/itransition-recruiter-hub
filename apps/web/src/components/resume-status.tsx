import { ResumeStatus } from "@rh/database/browser";
import { Badge, type BadgeProps } from "./ui/badge";
import type { FC } from "react";

export function getResumeStatusText(status: ResumeStatus) {
  switch (status) {
    case ResumeStatus.DRAFT:
      return "Draft";
    case ResumeStatus.PUBLISHED:
      return "Published";
    case ResumeStatus.PRIVATE:
      return "Private";
    default:
      return null;
  }
}

export const ResumeStatusBadge: FC<{
  status: ResumeStatus;
}> = ({ status }) => {
  let variant: BadgeProps["variant"] = "default";

  if (status === ResumeStatus.DRAFT) {
    variant = "secondary";
  }
  if (status === ResumeStatus.PUBLISHED) {
    variant = "success";
  }
  if (status === ResumeStatus.PRIVATE) {
    variant = "warning";
  }

  return <Badge variant={variant}>{getResumeStatusText(status)}</Badge>;
};
