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
import { GraduationCap, AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const { register, requestRegisterCode } = useAuth()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRequestingCode, setIsRequestingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState("")

  const handleRequestCode = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!email) {
      setError("请输入邮箱地址")
      return
    }

    setError("")
    setIsRequestingCode(true)

    try {
      await requestRegisterCode(email)
      setCodeSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送验证码失败")
    } finally {
      setIsRequestingCode(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      await register(email, code, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <GraduationCap className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl">创建账号</CardTitle>
          <CardDescription>注册一个新账号以使用毕业学分审查系统</CardDescription>
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
              <div className="flex space-x-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={codeSent}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRequestCode}
                  disabled={isRequestingCode || codeSent}
                >
                  {isRequestingCode ? <Spinner size="sm" /> : codeSent ? "已发送" : "获取验证码"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">验证码</Label>
              <Input
                id="code"
                type="text"
                placeholder="6位验证码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !codeSent}>
              {isLoading ? <Spinner className="mr-2" size="sm" /> : null}
              注册
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            已有账号?{" "}
            <Link href="/login" className="text-primary hover:underline">
              登录
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
