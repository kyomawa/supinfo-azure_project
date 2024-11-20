"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useState } from "react";
import FormTextAreaField from "@/components/FormFields/FormTextAreaField";
import { FormInputField } from "@/components/FormFields/FormInputField";
import FormFileField from "@/components/FormFields/FormFileField";
import { Form } from "@/components/ui/form";
import { post } from "@/utils/apiFn";
import { schemaCreatePostForm } from "@/constants/schema";
import { createFormData } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { Button } from "../../../../components/ui/button";
import { CirclePlus } from "lucide-react";
import { cn } from "@/lib/utils";

// ==============================================================================================================================

type CreationModalProps = {
  label: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

export default function CreationModal({ label, setIsOpen, isOpen }: CreationModalProps) {
  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <button
          className={cn(
            "flex max-xl:justify-center items-center gap-x-3 font-medium py-3.5 px-3 md:w-full relative",
            isOpen &&
              "max-md:after:rounded-full max-md:after:bg-primary-600 max-md:after:h-1 max-md:after:w-full max-md:after:absolute max-md:after:bottom-0 max-md:after:left-1/2 max-md:after:-translate-x-1/2"
          )}
        >
          <CirclePlus className={cn("size-6", isOpen && "md:stroke-primary-600 stroke-2 dark:md:stroke-primary-500")} />
          <span
            className={cn("text-neutral-600 dark:text-white/65 max-xl:hidden", isOpen && " dark:text-white text-black")}
          >
            {label}
          </span>
        </button>
      </CredenzaTrigger>
      <CredenzaContent className="min-w-[35vw]">
        <CredenzaHeader>
          <CredenzaTitle>Créer une nouvelle publication</CredenzaTitle>
          <CredenzaDescription>
            Remplissez les informations ci dessous pour créer une nouvelle publication.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <CreationForm setIsOpen={setIsOpen} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}

// ==============================================================================================================================

type CreationFormProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreationForm({ setIsOpen }: CreationFormProps) {
  const session = useSession();
  const userId = session.data?.user.id;
  const router = useRouter();
  const form = useForm<z.infer<typeof schemaCreatePostForm>>({
    resolver: zodResolver(schemaCreatePostForm),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<z.infer<typeof schemaCreatePostForm>> = async (
    values: z.infer<typeof schemaCreatePostForm>
  ) => {
    const toastId = toast.loading("Création de la publication en cours...");
    setIsLoading(true);

    const formData = createFormData({ ...values, creatorId: userId });
    const file = values.file;

    if (file.type.startsWith("image/")) {
      const result = await post("posts", formData);

      if (!result.success) {
        setIsLoading(false);
        toast.error(result.message, { id: toastId });
        return;
      }

      toast.success(result.message, { id: toastId });
      router.replace("/");
      setIsOpen(false);
      setIsLoading(false);
    } else if (file.type.startsWith("video/")) {
      post("posts", formData);
      await new Promise((resolve) => setTimeout(resolve, 750));
      form.reset();
      toast.success(
        "Votre vidéo est en cours de traitement. Votre publication apparaîtra dès que celle-ci sera validée.",
        {
          id: toastId,
        }
      );
      setIsOpen(false);
      setIsLoading(false);
      return;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        <FormTextAreaField
          title="Description"
          name="description"
          form={form}
          isRequired
          placeholder="Décrivez votre publication..."
        />
        <FormInputField title="Tags" name="tags" form={form} placeholder="Séparez les tags par des virgules" />
        <FormFileField
          title="Fichier"
          name="file"
          form={form}
          isRequired
          description="Ajoutez une image ou une vidéo."
        />
        <div className="flex max-md:flex-col justify-end gap-2 pb-4">
          <CredenzaClose asChild>
            <Button variant="outline">Annuler</Button>
          </CredenzaClose>
          <Button className="max-md:order-first" type="submit" isLoading={isLoading}>
            Créer le post
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ==============================================================================================================================
