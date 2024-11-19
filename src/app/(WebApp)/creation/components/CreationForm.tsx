"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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

// ==============================================================================================================================

// ==============================================================================================================================

export default function CreationForm({ userId }: { userId: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof schemaCreatePostForm>>({
    resolver: zodResolver(schemaCreatePostForm),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<z.infer<typeof schemaCreatePostForm>> = async (
    values: z.infer<typeof schemaCreatePostForm>
  ) => {
    setIsLoading(true);

    const formData = createFormData({ ...values, creatorId: userId });

    const result = await post("posts", formData);

    if (!result.success) {
      setIsLoading(false);
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    router.replace("/decouvrir");

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        <FormTextAreaField
          title="Description"
          name="description"
          form={form}
          isRequired
          placeholder="Décrivez votre post..."
        />
        <FormInputField title="Tags" name="tags" form={form} placeholder="Séparez les tags par des virgules" />
        <FormFileField
          title="Fichier"
          name="file"
          form={form}
          isRequired
          description="Ajoutez une image ou une vidéo."
        />
        <div className="flex justify-end gap-x-2">
          <Button type="submit" isLoading={isLoading}>
            Créer le post
          </Button>
        </div>
      </form>
    </Form>
  );
}
