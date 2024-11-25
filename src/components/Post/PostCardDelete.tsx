"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { del } from "@/utils/apiFn";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

// ==================================================================================================================================

type PostCardDeleteProps = {
  postId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete?: (postId: string) => void;
  mustNavigateBack?: boolean;
};

export default function PostCardDelete({ isOpen, setIsOpen, postId, onDelete, mustNavigateBack }: PostCardDeleteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    const toastId = toast.loading("Suppression de la publication en cours...");
    setIsLoading(true);

    const res = await del(`posts/${postId}`);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("Publication supprimée avec succès.", { id: toastId });
    if (onDelete) {
      onDelete(postId);
    }
    if (mustNavigateBack) {
      router.back();
    }
    setIsOpen(false);
    setIsLoading(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suppression de la publication</AlertDialogTitle>
          <AlertDialogDescription>
            Attention, vous êtes sur le point de supprimer cette publication. Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button isLoading={isLoading} onClick={handleClick}>
            Supprimer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ==================================================================================================================================
