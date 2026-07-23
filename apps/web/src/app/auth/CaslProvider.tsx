import { useAuthStore } from "@/store/useAuthStore";
import { createMongoAbility, AbilityBuilder } from "@casl/ability";
import { AbilityProvider } from "@casl/react";
import { UserRole, type User } from "@rh/database/browser";
import type { FC, PropsWithChildren } from "react";

function defineAbilitiesFor(user: User) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  if (user.role === UserRole.ADMINISTRATOR) {
    can("manage", "all");
  } else if (user.role === UserRole.RECRUITER) {
    can("manage", "Position");
    can("manage", "Attribute");
    can("read", "Resume");
    can("read", "Profile");
  } else if (user.role === UserRole.CANDIDATE) {
    can("apply", "Position");
    can("read", "Position");
    can("manage", "Profile", {
      userId: user.id,
    });
    can("manage", "Resume", {
      userId: user.id,
    });
  }

  return build();
}

export const CaslProvider: FC<PropsWithChildren> = ({ children }) => {
  const user = useAuthStore((store) => store.user);
  const ability = defineAbilitiesFor(user!);

  return <AbilityProvider value={ability}>{children}</AbilityProvider>;
};
