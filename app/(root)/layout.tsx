import type React from "react"
import { TopNavbar } from "@/components/top-navbar"
import { AuthProvider } from "@/contexts/auth-context"
import { Footer } from "@/components/footer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <TopNavbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
