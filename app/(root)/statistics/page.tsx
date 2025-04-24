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
import { AlertCircle, BarChart, PieChart, TrendingUp } from "lucide-react"

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

export default function StatisticsPage() {
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

  // Function to get color for chart elements
  const getColorForIndex = (index: number, isComplete = false) => {
    const colors = [
      "rgba(53, 162, 235, 0.8)",
      "rgba(75, 192, 192, 0.8)",
      "rgba(255, 99, 132, 0.8)",
      "rgba(255, 205, 86, 0.8)",
      "rgba(153, 102, 255, 0.8)",
      "rgba(255, 159, 64, 0.8)",
      "rgba(54, 162, 235, 0.8)",
      "rgba(153, 102, 255, 0.8)",
    ]

    // For completed categories, use a different shade
    if (isComplete) {
      return colors[index % colors.length].replace("0.8", "1.0")
    }

    return colors[index % colors.length]
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold">学分统计</h1>
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
                <BarChart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">没有培养方案</h3>
                <p className="text-muted-foreground mb-4">您需要先创建一个培养方案才能查看统计数据</p>
                <Button onClick={() => router.push("/programs/create")}>创建培养方案</Button>
              </CardContent>
            </Card>
          ) : !creditSummary ? (
            <Card className="text-center py-12">
              <CardContent>
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">无法加载数据</h3>
                <p className="text-muted-foreground mb-4">请选择一个培养方案查看学分统计</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    总体学分完成情况
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold">
                          {Math.round(
                            (creditSummary.total_earned_credits / creditSummary.total_required_credits) * 100,
                          )}
                          %
                        </div>
                        <div className="text-sm text-muted-foreground">完成进度</div>
                      </div>
                    </div>
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted opacity-20"
                      />
                      {/* Progress arc */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray={`${(creditSummary.total_earned_credits / creditSummary.total_required_credits) * 251.2} 251.2`}
                        className="text-primary"
                      />
                    </svg>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">已修学分</div>
                      <div className="text-2xl font-bold">{creditSummary.total_earned_credits}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">剩余学分</div>
                      <div className="text-2xl font-bold">{creditSummary.remaining_credits}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* GPA Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    GPA 信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-full">
                  <div className="text-center mb-8">
                    <div className="text-6xl font-bold">{formatGPA(creditSummary.overall_gpa)}</div>
                    <div className="text-xl text-muted-foreground mt-2">总 GPA</div>
                  </div>
                  <div className="w-full flex justify-center gap-4">
                    <div className="text-center">
                      <div className="font-bold text-3xl">{creditSummary.total_earned_credits}</div>
                      <div className="text-sm text-muted-foreground">GPA 计入学分</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Progress */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    各类别学分完成情况
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
                              width: `${(category.earned_credits / category.required_credits) * 100}%`,
                              backgroundColor: getColorForIndex(index, category.is_complete),
                            }}
                          />
                        </div>

                        {/* Sub-categories */}
                        {category.has_subcategories && category.subcategories.length > 0 && (
                          <div className="pl-6 space-y-2 mt-2">
                            {category.subcategories.map((subCategory, subIndex) => (
                              <div key={subCategory.category_id} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <div className="text-sm">{subCategory.category_name}</div>
                                  <div className="text-xs">
                                    <span className="font-medium">{subCategory.earned_credits}</span>
                                    <span className="text-muted-foreground">/{subCategory.required_credits}学分</span>
                                    <span className="ml-1 text-muted-foreground">
                                      ({Math.round((subCategory.earned_credits / subCategory.required_credits) * 100)}%)
                                    </span>
                                  </div>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{
                                      width: `${(subCategory.earned_credits / subCategory.required_credits) * 100}%`,
                                      backgroundColor: getColorForIndex(index * 10 + subIndex, subCategory.is_complete),
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
