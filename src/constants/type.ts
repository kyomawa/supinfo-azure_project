import { LucideIcon } from "lucide-react";

// ==========================================================================================================

export type SidebarLinkProps = {
  label: string;
  icon: LucideIcon;
  path?: string;
  onClick?: () => void;
};

// ==========================================================================================================

export type ResponseProps = { success: boolean; message: string };

// ==========================================================================================================
