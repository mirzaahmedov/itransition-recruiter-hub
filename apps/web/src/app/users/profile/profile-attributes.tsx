import type { User } from "@rh/database/browser";
import { type FC, type RefObject } from "react";
import type { UserAttributeWithJoins } from "./api";
import ProfileAttibutesForm, { type ProfileAttibutesFormHandlers } from "./profile-attributes-form";
import { ProfileAttributesView } from "./profile-attributes-view";

export const ProfileAttributes: FC<{
  methods: RefObject<ProfileAttibutesFormHandlers>;
  editing: boolean;
  user: User;
  attributes: UserAttributeWithJoins[];
}> = ({ methods, user, attributes, editing }) => {
  return editing ? (
    <ProfileAttibutesForm methods={methods} user={user} userAttributes={attributes} />
  ) : (
    <ProfileAttributesView userAttributes={attributes} />
  );
};
