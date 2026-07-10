import { BriefcaseIcon, ReadCvLogoIcon, TagIcon, UserFocusIcon, UserListIcon, UsersIcon } from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";

export const AppSidebar = () => {
  return (
    <div className="shrink-0 w-full max-w-xs bg-base-200 divide-y divide-base-divider">
      <div className="p-5 font-bold text-sm">
        <h1 className="flex items-center gap-2">
          <UserFocusIcon className="icon-md text-primary" />
          RecruiterHub
        </h1>
      </div>
      <div>
        <ul className="menu w-full">
          <li>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? "menu-active" : "")}>
              <UserListIcon className="icon" />
              Profile
            </NavLink>
            <NavLink to="/users" className={({ isActive }) => (isActive ? "menu-active" : "")}>
              <UsersIcon className="icon" />
              Users
            </NavLink>
            <NavLink to="/positions" className={({ isActive }) => (isActive ? "menu-active" : "")}>
              <BriefcaseIcon className="icon" />
              Positions
            </NavLink>
            <NavLink to="/cvs" className={({ isActive }) => (isActive ? "menu-active" : "")}>
              <ReadCvLogoIcon className="icon" />
              CVs
            </NavLink>
            <NavLink to="/attributes" className={({ isActive }) => (isActive ? "menu-active" : "")}>
              <TagIcon className="icon" />
              Attributes
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};
