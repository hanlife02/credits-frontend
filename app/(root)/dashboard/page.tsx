"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { trainingProgramApi, dashboardApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { AlertCircle, BarChart, PieChart, BookOpen, GraduationCap } from "lucide-react"

type TrainingProgram = {
  id: string
  name: string
  total_credits: number
  is_public: boolean
}

type CategorySummary = {
  category_id: string
  category_name: string
  required_credits: number
  earned_credits: number
  remaining_credits: number
  is_complete: boolean
  has_subcategories: boolean
  parent_id: string | null
  subcategories: CategorySummary[]
}

type CreditSummary = {
  total_required_credits: number
  total_earned_credits: number
  remaining_credits: number
  overall_gpa: number
  categories: CategorySummary[]
}

export default function DashboardPage() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([])
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
  const [creditSummary, setCreditSummary] = useState<CreditSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await trainingProgramApi.getPrograms()
        setPrograms(data)

        // If there are programs, select the first one by default
        if (data.length > 0) {
          setSelectedProgram(data[0].id)
        }
      } catch (err) {
        setError("获取培养方案失败")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  useEffect(() => {
    if (!selectedProgram) return

    const fetchCreditSummary = async () => {
      try {
        setLoading(true)
        const data = await dashboardApi.getCreditSummary(selectedProgram)
        setCreditSummary(data)
      } catch (err) {
        setError("获取学分汇总失败")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCreditSummary()
  }, [selectedProgram])

  // Format GPA to 3 decimal places
  const formatGPA = (gpa: number) => gpa.toFixed(3)

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold">仪表盘</h1>
            <Select value={selectedProgram || ""} onValueChange={setSelectedProgram} disabled={programs.length === 0}>
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="选择培养方案" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : programs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">没有培养方案</h3>
                <p className="text-muted-foreground mb-4">您需要先创建一个培养方案才能查看仪表盘</p>
                <Button onClick={() => router.push("/programs/create")}>创建培养方案</Button>
              </CardContent>
            </Card>
          ) : !creditSummary ? (
            <Card className="text-center py-12">
              <CardContent>
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">无法加载数据</h3>
                <p className="text-muted-foreground mb-4">请选择一个培养方案查看仪表盘</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">总学分要求</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{creditSummary.total_required_credits}</div>
                    <p className="text-xs text-muted-foreground mt-1">培养方案规定的总学分</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">已修学分</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{creditSummary.total_earned_credits}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((creditSummary.total_earned_credits / creditSummary.total_required_credits) * 100)}%
                      已完成
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">剩余学分</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{creditSummary.remaining_credits}</div>
                    <p className="text-xs text-muted-foreground mt-1">还需修读{creditSummary.remaining_credits}学分</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">总GPA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatGPA(creditSummary.overall_gpa)}</div>
                    <p className="text-xs text-muted-foreground mt-1">基于百分制成绩计算</p>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    学分完成进度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {creditSummary.categories.map((category, index) => (
                      <div key={category.category_id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{category.category_name}</div>
                          <div className="text-sm">
                            <span className="font-medium">{category.earned_credits}</span>
                            <span className="text-muted-foreground">/{category.required_credits}学分</span>
                            <span className="ml-2 text-muted-foreground">
                              ({Math.round((category.earned_credits / category.required_credits) * 100)}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, (category.earned_credits / category.required_credits) * 100)}%`,
                              backgroundColor: category.is_complete ? "#10b981" : "#3b82f6",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                  onClick={() => router.push("/courses")}
                >
                  <BookOpen className="h-6 w-6" />
                  <span>管理课程</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                  onClick={() => router.push("/programs")}
                >
                  <GraduationCap className="h-6 w-6" />
                  <span>培养方案</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center justify-center gap-2"
                  onClick={() => router.push("/statistics")}
                >
                  <BarChart className="h-6 w-6" />
                  <span>查看统计</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
