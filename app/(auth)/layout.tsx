import type React from "react"
import { AuthProvider } from "@/contexts/auth-context"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </AuthProvider>
  )
}
