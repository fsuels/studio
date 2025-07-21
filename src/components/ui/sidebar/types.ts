export type SidebarContext = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (_open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (_open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

export type SidebarProviderProps = React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (_open: boolean) => void;
};

export type SidebarProps = React.ComponentProps<'div'> & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
};

export type SidebarMenuButtonProps = React.ComponentProps<'button'> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<any>;
} & {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
};

export type SidebarMenuSubButtonProps = React.ComponentProps<'a'> & {
  asChild?: boolean;
  size?: 'sm' | 'md';
  isActive?: boolean;
};

export type SidebarMenuActionProps = React.ComponentProps<'button'> & {
  asChild?: boolean;
  showOnHover?: boolean;
};

export type SidebarMenuSkeletonProps = React.ComponentProps<'div'> & {
  showIcon?: boolean;
};

export type SidebarGroupLabelProps = React.ComponentProps<'div'> & {
  asChild?: boolean;
};

export type SidebarGroupActionProps = React.ComponentProps<'button'> & {
  asChild?: boolean;
};
