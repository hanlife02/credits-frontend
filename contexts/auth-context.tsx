"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  email: string
  is_active: boolean
  is_admin: boolean
  created_at: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, code: string, password: string) => Promise<void>
  requestRegisterCode: (email: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (email: string, code: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const checkAuth = async () => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
        const userData = await authApi.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      localStorage.removeItem("accessToken")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await authApi.login(email, password)
      const userData = await authApi.getCurrentUser()
      setUser(userData)
      toast({
        title: "登录成功",
        description: `欢迎回来，${userData.email}`,
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "登录失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    setUser(null)
    toast({
      title: "已退出登录",
    })
    router.push("/")
  }

  const register = async (email: string, code: string, password: string) => {
    setIsLoading(true)
    try {
      await authApi.confirmRegister(email, code, password)
      toast({
        title: "注册成功",
        description: "请使用您的凭据登录",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "注册失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const requestRegisterCode = async (email: string) => {
    try {
      await authApi.requestRegisterCode(email)
      toast({
        title: "验证码已发送",
        description: "请检查您的邮箱",
      })
    } catch (error) {
      toast({
        title: "发送验证码失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
      throw error
    }
  }

  const requestPasswordReset = async (email: string) => {
    try {
      await authApi.requestPasswordReset(email)
      toast({
        title: "重置密码验证码已发送",
        description: "请检查您的邮箱",
      })
    } catch (error) {
      toast({
        title: "发送验证码失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
      throw error
    }
  }

  const resetPassword = async (email: string, code: string, password: string) => {
    try {
      await authApi.confirmPasswordReset(email, code, password)
      toast({
        title: "密码重置成功",
        description: "请使用新密码登录",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "密码重置失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        requestRegisterCode,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
