import type { User } from "@rh/database/browser";
import { type FC } from "react";
import type { UserAttributeWithJoins } from "./api";
import ProfileAttibutesForm from "./profile-attributes-form";
import { ProfileAttributesView } from "./profile-attributes-view";

export const ProfileAttributes: FC<{
  editing: boolean;
  user: User;
  attributes: UserAttributeWithJoins[];
}> = ({ user, attributes, editing }) => {
  return editing ? <ProfileAttibutesForm user={user} userAttributes={attributes} /> : <ProfileAttributesView userAttributes={attributes} />;
};
