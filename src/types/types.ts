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

export type SidebarItem = SidebarLink | SidebarDropdown;
