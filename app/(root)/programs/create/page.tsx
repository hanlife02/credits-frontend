"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { trainingProgramApi } from "@/lib/api"
import { AlertCircle, ArrowLeft } from "lucide-react"

export default function CreateProgramPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [totalCredits, setTotalCredits] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("请输入培养方案名称")
      return
    }

    const credits = Number.parseFloat(totalCredits)
    if (isNaN(credits) || credits <= 0) {
      setError("请输入有效的学分数量")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const program = await trainingProgramApi.createProgram({
        name: name.trim(),
        total_credits: credits,
      })

      router.push(`/programs/${program.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建培养方案失败")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="icon" onClick={() => router.push("/programs")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">创建培养方案</h1>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>培养方案信息</CardTitle>
                <CardDescription>创建一个新的培养方案来管理您的学分要求</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">方案名称</Label>
                  <Input
                    id="name"
                    placeholder="如：计算机科学与技术"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalCredits">总学分要求</Label>
                  <Input
                    id="totalCredits"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="如：120"
                    value={totalCredits}
                    onChange={(e) => setTotalCredits(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/programs")}>
                  取消
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
                  创建培养方案
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
