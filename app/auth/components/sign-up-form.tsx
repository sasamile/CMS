"use client"

import { z } from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormWrapper } from "./form-wrapper"
import { PasswordInput } from "./password-input"
import { RegisterFormSchema } from "@/schemas/auth"
import { FormStateMessage } from "./form-state-message"
import { register } from "@/actions/auth"

export function SignUpForm() {
  const [error, setError] = useState<string | undefined>(undefined)
  const [success, setSuccess] = useState<string | undefined>(undefined)

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof RegisterFormSchema>) => {
    setError("")
    setSuccess("")

    try {
      const response = await register(values)

      if (response?.error) {
        setError(response?.error)
      }

      form.reset()
    } catch {
      toast.error("Algo salió mal!")
    }
  }

  return (
    <FormWrapper
      headerTitle="Crea una cuenta"
      headerSubtitle="Completa el formulario para registrarte"
      backButtonLabel="Ya tiene una cuenta? Iniciar sesión"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 mt-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      variant="largeRounded"
                      placeholder="Jhon Doe"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      variant="largeRounded"
                      type="email"
                      placeholder="ej. jhon@gmail.com"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput
                      variant="largeRounded"
                      field={field}
                      isSubmitting={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription className="text-[13.5px]">
                    La contraseña debe tener un mínimo de 8 caracteres.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormStateMessage type="Success" message={success} />
            <FormStateMessage type="Error" message={error} />
            <div className="pt-3 pb-2">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full font-semibold"
              >
                {isSubmitting && (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                )}
                Registrarse
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </FormWrapper>
  )
}
