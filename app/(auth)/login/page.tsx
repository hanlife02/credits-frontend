"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败，请检查您的凭据")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8"
      style={{
        backgroundImage: "url('/pku-lake.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Frosted glass overlay for the entire background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="container relative z-10 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center">
              <img src="/pku-logo.png" alt="PKU Logo" className="h-16 w-16" />
            </div>
            <CardTitle className="text-2xl">登录账号</CardTitle>
            <CardDescription>输入您的邮箱和密码登录系统</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/70"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">密码</Label>
                  <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
                    忘记密码?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/70"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Spinner className="mr-2" size="sm" /> : null}
                登录
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              还没有账号?{" "}
              <Link href="/register" className="text-primary hover:underline">
                注册
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
