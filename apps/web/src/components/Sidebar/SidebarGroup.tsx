import type { FC, PropsWithChildren } from "react";

export const SidebarGroup: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => {
  return (
    <div className="space-y-2">
      <p className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</p>

      {children}
    </div>
  );
};
