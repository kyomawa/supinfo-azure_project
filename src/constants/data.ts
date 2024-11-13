import { Home, Search, Bell, MessageCircle, User, Settings, Users, PlusCircle } from "lucide-react";
import { SidebarLinkProps } from "./type";

// =============================================================================================================================================

export const webAppUrl = "/app/";

// =============================================================================================================================================

export const sidebarLinks: SidebarLinkProps[] = [
  { path: "/", label: "Accueil", icon: Home },
  { label: "Recherche", icon: Search, onClick: () => console.log("Recherche sidebar ouverte") },
  { label: "Notifications", icon: Bell, onClick: () => console.log("Notifications sidebar ouverte") },
  { path: "/messages", label: "Messages", icon: MessageCircle },
  { label: "Créer un post", icon: PlusCircle, onClick: () => console.log("Modal de création de post ouverte") },
  { path: "/amis", label: "Amis", icon: Users },
  { path: "/profil", label: "Profil", icon: User },
  { path: "/parametres", label: "Paramètres", icon: Settings },
];
// =============================================================================================================================================
