import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";

type SidebarItemProps = {
  to: string;
  icon: ReactNode;
  title: string;
};

export function SidebarItem({ to, icon, title }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex h-11 items-center gap-3 rounded-xl px-3 transition ${
          isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <div className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />}

          {icon}
          <span>{title}</span>
        </>
      )}
    </NavLink>
  );
}
