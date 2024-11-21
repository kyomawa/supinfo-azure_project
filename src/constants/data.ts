import { Home, Search, Bell, User, Settings, LogOut, Compass, CirclePlus } from "lucide-react";
import { SidebarLinkProps } from "./type";
import { logout } from "@/actions/auth/action";

// =============================================================================================================================================

export const sidebarLinks: SidebarLinkProps[] = [
  { path: "/", label: "Accueil", icon: Home },
  { path: "/recherche", label: "Recherche", icon: Search },
  { path: "/decouvrir", label: "Découvrir", icon: Compass },
  { label: "Création", icon: CirclePlus },
  { path: "/notifications", label: "Notifications", icon: Bell },
  { path: "/profil", label: "Profil", icon: User },
  { path: "/parametres", label: "Paramètres", icon: Settings },
  { label: "Se déconnecter", icon: LogOut, onClick: () => logout() },
];
// =============================================================================================================================================

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 150;
export const ACCEPTED_FILE_TYPES = ["image/png", "image/jpg", "image/jpeg", "image/webp", "image/svg+xml"];

// =============================================================================================================================================
