# Sidebar Components

This directory contains a modular breakdown of the sidebar component system, organized into focused, reusable components.

## Structure

```
sidebar/
├── README.md                    # This documentation
├── index.tsx                    # Main export file
├── constants.ts                 # Sidebar constants and configuration
├── types.ts                     # TypeScript type definitions
├── SidebarProvider.tsx          # Context provider and hooks
├── SidebarCore.tsx              # Main sidebar component and inset
├── SidebarLayout.tsx            # Layout components (Header, Footer, Content, Separator)
├── SidebarGroup.tsx             # Group components (Group, GroupLabel, GroupAction, GroupContent)
├── SidebarMenu.tsx              # Menu components (Menu, MenuItem, MenuButton, MenuAction, MenuBadge, MenuSkeleton)
├── SidebarMenuSub.tsx           # Submenu components (MenuSub, MenuSubItem, MenuSubButton)
└── SidebarControls.tsx          # Control components (Trigger, Rail, Input)
```

## Components by Category

### Context & Provider
- **SidebarProvider**: Main context provider with state management
- **useSidebar**: Hook to access sidebar context

### Core Components
- **Sidebar**: Main sidebar container with mobile/desktop logic
- **SidebarInset**: Main content area that adjusts to sidebar state

### Layout Components
- **SidebarHeader**: Header section of the sidebar
- **SidebarFooter**: Footer section of the sidebar
- **SidebarContent**: Scrollable content area
- **SidebarSeparator**: Visual separator component

### Group Components
- **SidebarGroup**: Container for grouped content
- **SidebarGroupLabel**: Label for a group
- **SidebarGroupAction**: Action button for a group
- **SidebarGroupContent**: Content container within a group

### Menu Components
- **SidebarMenu**: List container for menu items
- **SidebarMenuItem**: Individual menu item container
- **SidebarMenuButton**: Interactive menu button with tooltip support
- **SidebarMenuAction**: Action button for menu items
- **SidebarMenuBadge**: Badge/counter for menu items
- **SidebarMenuSkeleton**: Loading skeleton for menu items

### Submenu Components
- **SidebarMenuSub**: Container for submenu items
- **SidebarMenuSubItem**: Individual submenu item container
- **SidebarMenuSubButton**: Interactive submenu button

### Control Components
- **SidebarTrigger**: Button to toggle sidebar state
- **SidebarRail**: Hover area for expanding collapsed sidebar
- **SidebarInput**: Input component styled for sidebar

## Usage

```tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

function App() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    Home
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          Footer content
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
```

## Benefits of Modular Structure

1. **Separation of Concerns**: Each file handles a specific aspect of the sidebar functionality
2. **Maintainability**: Easier to locate and modify specific components
3. **Reusability**: Individual components can be imported and used independently
4. **Testability**: Each component can be tested in isolation
5. **Bundle Optimization**: Tree-shaking can eliminate unused components
6. **Developer Experience**: Clear organization and focused responsibilities

## Migration

The original `/components/ui/sidebar.tsx` now re-exports all components from this modular structure, ensuring backward compatibility. No changes are required for existing imports.