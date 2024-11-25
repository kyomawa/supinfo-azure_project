"use client";

import { User } from "@prisma/client";
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import toast from "react-hot-toast";
import { patch } from "@/utils/apiFn";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaUpdateProfileForm } from "@/constants/schema";
import FormTextAreaField from "@/components/FormFields/FormTextAreaField";
import { FormInputField } from "@/components/FormFields/FormInputField";

// ==================================================================================================================================

type ProfileEditButtonProps = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

export default function ProfileEditButton({ user, setUser }: ProfileEditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <Button variant="secondary">Modifier le profil</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Modification de votre profil</CredenzaTitle>
          <CredenzaDescription>
            Editez le formulaire ci-dessous pour mettre à jour vos informations.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <ProfileForm user={user} setIsOpen={setIsOpen} setUser={setUser} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}

// ==================================================================================================================================

type ProfileFormProps = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function ProfileForm({ user, setIsOpen, setUser }: ProfileFormProps) {
  const { username, bio, name } = user;
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof schemaUpdateProfileForm>>({
    resolver: zodResolver(schemaUpdateProfileForm),
    defaultValues: {
      username,
      name: name as string,
      bio: bio || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schemaUpdateProfileForm>) => {
    setIsLoading(true);
    const toastId = toast.loading("Mise à jour du profil en cours...");

    const response = await patch<User>(`users/${user.id}`, values);
    if (response.success) {
      toast.success(response.message, { id: toastId });
      setIsOpen(false);
      setIsLoading(false);
      setUser(response.data);
    } else {
      toast.error(response.message, { id: toastId });
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6 my-px">
        <FormInputField title="Nom" name="name" form={form} placeholder="Nom de profil" />
        <FormInputField title="Nom d'utilisateur" name="username" form={form} placeholder="Nom d'utilisateur" />
        <FormTextAreaField title="Bio" name="bio" form={form} placeholder="Rédiger votre bio..." />
        <div className="flex max-md:flex-col justify-end gap-2">
          <CredenzaClose asChild>
            <Button variant="outline">Annuler</Button>
          </CredenzaClose>
          <Button className="max-md:order-first" type="submit" isLoading={isLoading}>
            Modifier
          </Button>
        </div>
      </form>
    </Form>
  );
}

// ==================================================================================================================================
