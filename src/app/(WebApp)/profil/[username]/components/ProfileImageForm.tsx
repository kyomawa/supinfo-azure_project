"use client";

import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, createFormData, onImageChangeCompress } from "@/lib/utils";
import { z } from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ImageUp, Loader, UserIcon } from "lucide-react";
import { schemaUpdateProfileImageForm } from "@/constants/schema";
import Image from "next/image";
import { patch } from "@/utils/apiFn";
import { User } from "@prisma/client";

// =============================================================================================================================================

type ProfileImageFormProps = {
  id: string;
  image: string | null;
  userConnectedOwnTheProfil: boolean;
  username: string;
};

export default function ProfileImageForm({ image, username, id, userConnectedOwnTheProfil }: ProfileImageFormProps) {
  const [actualImage, setActualImage] = useState<string | null>(image);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isHover, setIsHover] = useState(false);

  let toastId = "";

  const form = useForm<z.infer<typeof schemaUpdateProfileImageForm>>({
    resolver: zodResolver(schemaUpdateProfileImageForm),
    defaultValues: {
      image: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof schemaUpdateProfileImageForm>) => {
    setIsLoading(true);

    const imageFile = compressedFile || values.image;
    const formData = createFormData({
      image: imageFile,
    });

    const response = await patch<User>(`users/${id}/avatar`, formData);
    if (response.success) {
      setActualImage(response.data?.image);
      toast.success(response.message, { id: toastId });
    } else {
      toast.error(response.message, { id: toastId });
    }
    setIsLoading(false);
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>, onChange: (...event: unknown[]) => void) => {
    toastId = toast.loading("Mise à jour de l'image de profil...");
    await onImageChangeCompress(event, onChange, setCompressedFile, setIsLoading, async () => {
      await form.handleSubmit(onSubmit)();
      event.target.value = "";
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-8 max-[500px]:size-full min-[500px]:items-center"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormControl>
                <motion.div
                  onHoverStart={() => {
                    if (!isLoading) setIsHover(true);
                  }}
                  onHoverEnd={() => setIsHover(false)}
                  className={cn(
                    "aspect-square relative size-full min-[500px]:size-56 rounded-full",

                    isImageLoading && actualImage && "bg-primary-600/85 dark:bg-primary-300/85"
                  )}
                >
                  <AnimatePresence>
                    {isLoading && (
                      <div className="absolute z-[2] bg-primary-600 dark:bg-primary-700 rounded-full size-full font-medium flex justify-center items-center">
                        <Loader className="animate-loading size-6 text-white" />
                      </div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isHover && userConnectedOwnTheProfil && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className="absolute z-[2] bg-black/50 size-full rounded-full font-medium flex justify-center items-center pointer-events-none"
                      >
                        <ImageUp className="size-6 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {actualImage ? (
                    <Image
                      src={actualImage}
                      alt={`Avatar de ${username}`}
                      fill
                      className="rounded-full object-cover"
                      quality={100}
                      sizes="100vw, (min-width: 500px) 14rem"
                      priority
                      onLoad={() => setIsImageLoading(false)}
                    />
                  ) : (
                    <div className="bg-black/5 dark:bg-white/10 size-full overflow-hidden relative rounded-full">
                      <UserIcon
                        className="absolute -bottom-20 sm:-bottom-12 md:-bottom-10 xl:-bottom-12 2xl:-bottom-16 2k:-bottom-20 left-1/2 size-full -translate-x-1/2 fill-neutral-500 text-neutral-500 dark:fill-white dark:text-white"
                        strokeWidth={0.75}
                      />
                    </div>
                  )}
                  <Input
                    className={cn(
                      "z-[1] absolute size-full inset-0 opacity-0 disabled:cursor-auto disabled:hidden",
                      !isLoading && userConnectedOwnTheProfil && "cursor-pointer"
                    )}
                    variant="file"
                    disabled={!userConnectedOwnTheProfil}
                    type="file"
                    name={name}
                    ref={ref}
                    onChange={(e) => handleChange(e, onChange)}
                    onBlur={onBlur}
                  />
                </motion.div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

// ===================================================================================================
