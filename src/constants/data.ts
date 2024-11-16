import { Home, Search, Bell, MessageCircle, User, Settings, Users, LogOut, SquarePlus } from "lucide-react";
import { SidebarLinkProps } from "./type";
import { logout } from "@/actions/auth/action";

// =============================================================================================================================================

export const webAppUrl = "/app/";

// =============================================================================================================================================

export const sidebarLinks: SidebarLinkProps[] = [
  { path: "/", label: "Accueil", icon: Home },
  { label: "Recherche", icon: Search, onClick: () => console.log("Recherche sidebar ouverte") },
  { label: "Notifications", icon: Bell, onClick: () => console.log("Notifications sidebar ouverte") },
  { path: "/messages", label: "Messages", icon: MessageCircle },
  { label: "Créer un post", icon: SquarePlus, onClick: () => console.log("Modal de création de post ouverte") },
  { path: "/amis", label: "Amis", icon: Users },
  { path: "/profil", label: "Profil", icon: User },
  { path: "/parametres", label: "Paramètres", icon: Settings },
  { label: "Se déconnecter", icon: LogOut, onClick: () => logout() },
];
// =============================================================================================================================================
