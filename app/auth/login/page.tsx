"use client"

import { Suspense } from "react"
import { SignInForm } from "../components/sign-in-form"
import { Loader } from "@/components/common/loader"

export default function LoginPage() {
  return (
    <div className="flex items-center h-full">
      <Suspense fallback={<Loader />}>
        <SignInForm />
      </Suspense>
    </div>
  )
}
