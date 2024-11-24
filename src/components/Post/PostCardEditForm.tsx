import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { schemaEditPostForm } from "@/constants/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormTextAreaField from "../FormFields/FormTextAreaField";
import { FormInputField } from "../FormFields/FormInputField";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { patch } from "@/utils/apiFn";

// ========================================================================================================================================

type PostCardEditFormProps = {
  description: string;
  tags: string[];
  postId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate?: (updatedPost: PostEndpointProps) => void;
};

export default function PostCardEditForm({
  description,
  tags,
  postId,
  isOpen,
  setIsOpen,
  onUpdate,
}: PostCardEditFormProps) {
  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Modification de la publication</CredenzaTitle>
          <CredenzaDescription>Mettez à jour les informations de la publication ci-dessous.</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <EditForm description={description} tags={tags} postId={postId} setIsOpen={setIsOpen} onUpdate={onUpdate} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}

// ========================================================================================================================================

type EditFormProps = {
  description: string;
  tags: string[];
  postId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate?: (updatedPost: PostEndpointProps) => void;
};

function EditForm({ description, tags, postId, setIsOpen, onUpdate }: EditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof schemaEditPostForm>>({
    resolver: zodResolver(schemaEditPostForm),
    defaultValues: {
      description,
      tags: tags.join(", "),
    },
  });

  const onSubmit = async (values: z.infer<typeof schemaEditPostForm>) => {
    const toastId = toast.loading("Modification de la publication en cours...");
    setIsLoading(true);

    const newTags = values.tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    const originalTags = tags;

    const isDescriptionUnchanged = values.description === description;
    const isTagsUnchanged = JSON.stringify(newTags) === JSON.stringify(originalTags);

    if (isDescriptionUnchanged && isTagsUnchanged) {
      toast.error("Veuillez effectuer une modification.", { id: toastId });
      setIsLoading(false);
      return;
    }

    const result = await patch<PostEndpointProps>(`posts/${postId}`, values);

    if (!result.success) {
      setIsLoading(false);
      toast.error(result.message, { id: toastId });
      return;
    }

    toast.success(result.message, { id: toastId });

    if (onUpdate) {
      onUpdate(result.data);
    }

    setIsOpen(false);
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
          placeholder="Décrivez votre publication..."
        />
        <FormInputField title="Tags" name="tags" form={form} placeholder="Séparez les tags par des virgules" />
        <div className="flex max-md:flex-col justify-end gap-2 pb-4">
          <CredenzaClose asChild>
            <Button variant="outline">Annuler</Button>
          </CredenzaClose>
          <Button className="max-md:order-first" type="submit" isLoading={isLoading}>
            Modifier la publication
          </Button>
        </div>
      </form>
    </Form>
  );
}
