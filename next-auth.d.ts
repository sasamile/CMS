import { UserRole, Entity } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string | null;
  name: string | null;
  image: string | null;
  email: string | null;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

