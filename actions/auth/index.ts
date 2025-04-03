"use server"

import { z } from "zod"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import bcrypt from "bcryptjs"

import { LoginFormSchema, RegisterFormSchema } from "@/schemas/auth"
import { getUserByEmail } from "@/actions/user"
import { db } from "@/lib/db"
import { DEFAULT_AUTH_REDIRECT } from "@/routes"

export async function login(credentials: z.infer<typeof LoginFormSchema>) {
  const result = LoginFormSchema.safeParse(credentials)

  if (result.error) {
    return { error: "Credenciales invalidas!" }
  }

  const { email, password } = result.data

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: process.env.DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas!" }
        default:
          return { error: "Algo salió mal en el proceso!" }
      }
    }

    throw error
  }
}

export async function register(
  credentials: z.infer<typeof RegisterFormSchema>
) {
  const result = RegisterFormSchema.safeParse(credentials)

  if (result.error) {
    return { error: "Datos invalidos!" }
  }

  const { name, email, password } = result.data

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return { error: "El correo ingresado ya esta en uso!" }
    }

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    await signIn("credentials", {
      email,
      password,
      redirectTo: process.env.DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas!" }
        default:
          return { error: "Algo salió mal en el proceso!" }
      }
    }

    throw error
  }
}

export async function logout() {
  await signOut({ redirectTo: DEFAULT_AUTH_REDIRECT })
}
