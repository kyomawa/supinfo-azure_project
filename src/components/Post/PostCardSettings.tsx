"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Ellipsis } from "lucide-react";

// ==================================================================================================================================

type SettingsProps = {
  className?: string;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PostCardSettings({ setIsDeleteModalOpen, setIsEditModalOpen, className }: SettingsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className={cn("size-6", className)} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Paramètres</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setIsDeleteModalOpen(true)}>
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ==================================================================================================================================
