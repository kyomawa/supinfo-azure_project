"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import TooltipComponent from "@/components/TooltipComponent";
import { Trash } from "lucide-react";
import { del } from "@/utils/apiFn";
import toast from "react-hot-toast";
import { useState } from "react";
import { logout } from "@/actions/auth/action";
import { cn } from "@/lib/utils";

// ==================================================================================================================================

type UserCardDeleteButtonProps = {
  userId: string;
};

export default function UserCardDeleteButton({ userId }: UserCardDeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const toastId = toast.loading("Suppression du compte...");
    setIsLoading(true);

    const res = await del(`/user/${userId}`);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    await logout();

    toast.success("Compte supprimé avec succès.", { id: toastId });
    setIsLoading(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger className="max-sm:absolute top-6 right-6">
        <TooltipComponent label="Supprimer le compte" side="left">
          <div className={cn(buttonVariants({ variant: "destructive" }))}>
            <Trash className="size-6" />
          </div>
        </TooltipComponent>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suppression du compte</AlertDialogTitle>
          <AlertDialogDescription>
            Attention : toutes les données associées à ce compte seront également supprimées, cette action est
            irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button isLoading={isLoading} onClick={handleDelete} variant="destructive">
            Supprimer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ==================================================================================================================================
