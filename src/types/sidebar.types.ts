import { ReactNode } from 'react';

export interface SubItem {
  key: number;
  icon: ReactNode;
  label: string;
  path?: string;
}

export interface SidebarItem {
  key: number;
  icon: ReactNode;
  label: string;
  path?: string;
  subItems?: SubItem[];
}

export interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarItems: SidebarItem[];
}