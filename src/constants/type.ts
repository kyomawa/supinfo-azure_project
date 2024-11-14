import { LucideProps } from "lucide-react";

// ==========================================================================================================

export type SidebarLinkProps = {
  label: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  path?: string;
  onClick?: () => void;
};

// ==========================================================================================================

export type ResponseProps = { success: boolean; message: string };

// ==========================================================================================================
