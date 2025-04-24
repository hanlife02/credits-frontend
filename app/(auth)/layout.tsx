import type React from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
