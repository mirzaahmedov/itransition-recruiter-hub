import { FolderIcon, ReadCvLogoIcon, UserCircleIcon, UserIcon, UserListIcon } from "@phosphor-icons/react";
import { Link, NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "./ui/sidebar";

export const AppSidebar = () => {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={
                <Link to="/">
                  <span className="size-8 shrink-0 bg-blue-400 text-white rounded-xl grid place-items-center">
                    <ReadCvLogoIcon className="icon" />
                  </span>
                  <span className="font-bold text-md">RecruiterHub</span>
                </Link>
              }
            ></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Candidate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <NavLink to="/users">
                      <UserIcon size={18} />
                      Users
                    </NavLink>
                  }
                ></SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <NavLink to="/profile">
                      <UserIcon size={18} />
                      Profile
                    </NavLink>
                  }
                ></SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <NavLink to="/attributes">
                      <FolderIcon size={18} />
                      Attributes
                    </NavLink>
                  }
                ></SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};
