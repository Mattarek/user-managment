export type SidebarLink = {
  type: 'link';
  label: string;
  path: string;
};

export type SidebarDropdown = {
  type: 'dropdown';
  label: string;
  children: {
    label: string;
    path: string;
  }[];
};

export type Mode = 'light' | 'dark';

export type SidebarItem = SidebarLink | SidebarDropdown;
