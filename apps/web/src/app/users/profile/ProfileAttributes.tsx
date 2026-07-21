import type { User } from "@rh/database/browser";
import { useState, type FC } from "react";
import type { UserAttributeWithJoins } from "./api";
import ProfileAttibutesForm from "./ProfileAttributesForm";
import { ProfileAttributesView } from "./ProfileAttributesView";
import { useQueryClient } from "@tanstack/react-query";

export const ProfileAttributes: FC<{
  user: User;
  attributes: UserAttributeWithJoins[];
}> = ({ user, attributes }) => {
  const [editing, setEditing] = useState(false);

  const queryClient = useQueryClient();

  return editing ? (
    <ProfileAttibutesForm
      user={user}
      userAttributes={attributes}
      onStopEditing={() => {
        setEditing(false);
        queryClient.invalidateQueries({
          queryKey: ["users", user.id, "attributes"],
        });
      }}
    />
  ) : (
    <ProfileAttributesView userAttributes={attributes} onEdit={() => setEditing(true)} />
  );
};
