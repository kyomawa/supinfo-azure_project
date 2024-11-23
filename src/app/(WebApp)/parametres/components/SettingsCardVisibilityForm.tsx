"use client";

import FormSelectField from "@/components/FormFields/FormSelectField";
import { Form } from "@/components/ui/form";
import { schemaSettingsCardVisibilityForm } from "@/constants/schema";
import { patch } from "@/utils/apiFn";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// ==================================================================================================================================

type SettingsCardVisibilityFormProps = {
  id: string;
  visibility: "PUBLIC" | "PRIVATE" | "FRIENDS";
};

export default function SettingsCardVisibilityForm({ id, visibility }: SettingsCardVisibilityFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof schemaSettingsCardVisibilityForm>>({
    resolver: zodResolver(schemaSettingsCardVisibilityForm),
    defaultValues: {
      visibility,
    },
  });

  const onSubmit = async (values: z.infer<typeof schemaSettingsCardVisibilityForm>) => {
    setIsLoading(true);
    const toastId = toast.loading("Mise à jour de la visibilité en cours...");

    const response = await patch<User>(`users/${id}/visibility`, values);
    if (response.success) {
      toast.success(response.message, { id: toastId });
    } else {
      toast.error(response.message, { id: toastId });
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-y-6">
        <FormSelectField
          labelClassName="text-sm text-neutral-500 dark:text-white/40"
          className="w-full"
          title="Visibilité"
          name="visibility"
          disabled={isLoading}
          placeholder="Sélectionnez une option"
          form={form}
          onChange={() => form.handleSubmit(onSubmit)()}
          options={[
            { label: "Public", value: "PUBLIC" },
            { label: "Privé", value: "PRIVATE" },
            { label: "Amis seulement", value: "FRIENDS" },
          ]}
        />
      </form>
    </Form>
  );
}

// ==================================================================================================================================
