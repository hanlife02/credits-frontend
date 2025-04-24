import type React from "react"
import { TopNavbar } from "@/components/top-navbar"
import { AuthProvider } from "@/contexts/auth-context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <TopNavbar />
        <main className="min-h-screen">{children}</main>
      </div>
    </AuthProvider>
  )
}
