"use client";

import { loginWithEmail } from "@/actions/auth/action";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInputField } from "@/components/ui/FormFields/FormInputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ==================================================================================================================================

type LoginWithEmailButtonProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoginWithEmailButton({ isLoading, setIsLoading }: LoginWithEmailButtonProps) {
  const form = useForm<z.infer<typeof LoginWithEmailButtonSchema>>({
    resolver: zodResolver(LoginWithEmailButtonSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginWithEmailButtonSchema>) => {
    setIsLoading(true);
    await loginWithEmail(values.email);
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form className="space-y-12" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField title="Email" name="email" type="email" placeholder="jean-buisson@gmail.com" form={form} />
        <Button isLoading={isLoading} className="w-full" variant="default">
          S&apos;authentifier
        </Button>
      </form>
    </Form>
  );
}

// ==================================================================================================================================

const LoginWithEmailButtonSchema = z.object({
  email: z
    .string({ required_error: "L'adresse mail est requise." })
    .email({ message: "Veuillez entrer une adresse mail." })
    .max(85, { message: "Veuillez entrer une adresse mail valide." }),
});

// ==================================================================================================================================
