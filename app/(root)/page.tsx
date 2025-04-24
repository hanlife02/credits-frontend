"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, BarChart, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero section with background image and subtle frosted glass effect */}
        <div
          className="relative flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 min-h-[70vh] text-white"
          style={{
            backgroundImage: "url('/pku-lake.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Subtle frosted glass overlay */}
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]"></div>

          <div className="relative z-10 max-w-5xl w-full mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img src="/pku-logo.png" alt="PKU Logo" className="h-24 w-24" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">毕业学分审查系统</h1>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              轻松跟踪您的课程学分和毕业要求，智能分析您的学分进度，辅助您的选课决策。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                <Link href="/register">立即注册</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20 dark:border-white dark:text-white dark:hover:bg-white/20"
              >
                <Link href="/login">登录账号</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <GraduationCap className="h-12 w-12 mb-4" />
            <h2 className="text-xl font-bold mb-2">个性化培养方案</h2>
            <p className="text-muted-foreground">创建或选择适合您的培养方案，轻松管理课程类别和学分要求。</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <BookOpen className="h-12 w-12 mb-4" />
            <h2 className="text-xl font-bold mb-2">课程管理</h2>
            <p className="text-muted-foreground">添加和管理您的课程信息，包括学分、成绩和类别，随时修改更新。</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <BarChart className="h-12 w-12 mb-4" />
            <h2 className="text-xl font-bold mb-2">学分分析</h2>
            <p className="text-muted-foreground">直观了解您的总学分进度、GPA和各类别学分完成情况。</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <CheckCircle className="h-12 w-12 mb-4" />
            <h2 className="text-xl font-bold mb-2">毕业审查</h2>
            <p className="text-muted-foreground">清晰展示您离毕业要求还有多远，帮助您有针对性地规划选课。</p>
          </div>
        </div>

        <div className="py-16 bg-gray-100 dark:bg-gray-900">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">系统优势</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">灵活的培养方案管理</h3>
                <p className="text-muted-foreground">
                  您可以根据自己的专业和年级选择现有培养方案，也可以创建全新的培养方案。系统支持多级课程类别，方便您精细化管理学分要求。
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">智能学分计算</h3>
                <p className="text-muted-foreground">
                  系统自动计算并展示您的总学分、GPA以及各类别学分完成情况，帮助您掌握学习进度，确保满足毕业要求。
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">直观的数据可视化</h3>
                <p className="text-muted-foreground">
                  通过图表和进度指示器，直观展示您的学分完成情况和GPA变化趋势，让您对自己的学业状况一目了然。
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">辅助选课决策</h3>
                <p className="text-muted-foreground">
                  系统清晰显示各类别还需修读的学分，帮助您合理规划未来的选课计划，避免毕业前出现学分缺口。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
