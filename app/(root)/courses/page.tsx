"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { trainingProgramApi, courseCategoryApi, courseApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { AlertCircle, Plus, Edit, Trash, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type TrainingProgram = {
  id: string
  name: string
  total_credits: number
  is_public: boolean
}

type FlatCategory = {
  id: string
  name: string
  required_credits: number
  training_program_id: string
  parent_id: string | null
  fullName: string // Includes parent category names for display
}

type Course = {
  id: string
  name: string
  credits: number
  grading_system: "percentage" | "pass_fail"
  grade: number | null
  passed: boolean | null
  gpa: number | null
  category_id: string
  created_at: string
  updated_at: string
}

export default function CoursesPage() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([])
  const [selectedProgramId, setSelectedProgramId] = useState<string>("")
  const [flatCategories, setFlatCategories] = useState<FlatCategory[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const [showCourseDialog, setShowCourseDialog] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null)

  const [courseName, setCourseName] = useState("")
  const [courseCredits, setCourseCredits] = useState("")
  const [gradingSystem, setGradingSystem] = useState<"percentage" | "pass_fail">("percentage")
  const [grade, setGrade] = useState("")
  const [passed, setPassed] = useState(true)
  const [categoryId, setCategoryId] = useState("")

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [savingCourse, setSavingCourse] = useState(false)
  const [deletingCourse, setDeletingCourse] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()

  // Fetch programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await trainingProgramApi.getPrograms()
        setPrograms(data)

        // If there are programs, select the first one by default
        if (data.length > 0) {
          setSelectedProgramId(data[0].id)
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

  // Fetch categories and courses when program changes
  useEffect(() => {
    if (!selectedProgramId) return

    const fetchCategories = async () => {
      try {
        setLoading(true)
        const categoriesTree = await courseCategoryApi.getProgramCategories(selectedProgramId)
        const flat = flattenCategories(categoriesTree)
        setFlatCategories(flat)
      } catch (err) {
        setError("获取课程类别失败")
        console.error(err)
      }
    }

    const fetchCourses = async () => {
      try {
        const data = await courseApi.getCourses()
        setCourses(data)
        setFilteredCourses(data)
      } catch (err) {
        setError("获取课程信息失败")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
    fetchCourses()
  }, [selectedProgramId])

  // Update filtered courses when search term or courses change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCourses(courses)
    } else {
      const term = searchTerm.toLowerCase()
      setFilteredCourses(courses.filter((course) => course.name.toLowerCase().includes(term)))
    }
  }, [searchTerm, courses])

  // Flatten category tree to array
  const flattenCategories = (categories: any[], parentNames: string[] = []): FlatCategory[] => {
    let result: FlatCategory[] = []

    categories.forEach((category) => {
      const fullNameParts = [...parentNames, category.name]
      const flatCategory: FlatCategory = {
        ...category,
        fullName: fullNameParts.join(" > "),
      }

      result.push(flatCategory)

      if (category.subcategories && category.subcategories.length > 0) {
        result = result.concat(flattenCategories(category.subcategories, fullNameParts))
      }
    })

    return result
  }

  const handleAddCourse = () => {
    setIsEditMode(false)
    setCurrentCourse(null)
    setCourseName("")
    setCourseCredits("")
    setGradingSystem("percentage")
    setGrade("")
    setPassed(true)
    setCategoryId(flatCategories.length > 0 ? flatCategories[0].id : "")
    setShowCourseDialog(true)
  }

  const handleEditCourse = (course: Course) => {
    setIsEditMode(true)
    setCurrentCourse(course)
    setCourseName(course.name)
    setCourseCredits(course.credits.toString())
    setGradingSystem(course.grading_system)
    setGrade(course.grade ? course.grade.toString() : "")
    setPassed(course.passed === true)
    setCategoryId(course.category_id)
    setShowCourseDialog(true)
  }

  const handleSaveCourse = async () => {
    if (!courseName.trim()) {
      setError("请输入课程名称")
      return
    }

    const credits = Number.parseFloat(courseCredits)
    if (isNaN(credits) || credits <= 0) {
      setError("请输入有效的学分数量")
      return
    }

    if (gradingSystem === "percentage") {
      const gradeValue = Number.parseFloat(grade)
      if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
        setError("请输入有效的成绩（0-100）")
        return
      }
    }

    setSavingCourse(true)
    try {
      const courseData = {
        name: courseName.trim(),
        credits,
        grading_system: gradingSystem,
        category_id: categoryId,
      }

      if (gradingSystem === "percentage") {
        Object.assign(courseData, { grade: Number.parseFloat(grade) })
      } else {
        Object.assign(courseData, { passed })
      }

      let updatedCourse
      if (isEditMode && currentCourse) {
        updatedCourse = await courseApi.updateCourse(currentCourse.id, courseData)
        setCourses(courses.map((c) => (c.id === currentCourse.id ? updatedCourse : c)))
      } else {
        updatedCourse = await courseApi.createCourse(courseData as any)
        setCourses([...courses, updatedCourse])
      }

      setShowCourseDialog(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : isEditMode ? "更新课程失败" : "创建课程失败")
    } finally {
      setSavingCourse(false)
    }
  }

  const handleDeleteCourse = async () => {
    if (!deleteId) return

    setDeletingCourse(true)
    try {
      await courseApi.deleteCourse(deleteId)
      setCourses(courses.filter((course) => course.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      setError("删除课程失败")
      console.error(err)
    } finally {
      setDeletingCourse(false)
    }
  }

  const getCategoryNameById = (id: string) => {
    const category = flatCategories.find((cat) => cat.id === id)
    return category ? category.fullName : "未知类别"
  }

  const calculateGPA = (grade: number) => {
    return Number.parseFloat((4 - (3 * Math.pow(100 - grade, 2)) / 1600).toFixed(3))
  }

  if (loading && programs.length === 0) {
    return (
      <ProtectedRoute>
        <div className="container py-8 flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold">课程管理</h1>
            <Button onClick={handleAddCourse} className="sm:w-auto w-full">
              <Plus className="mr-2 h-4 w-4" />
              添加课程
            </Button>
          </div>

          {programs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">没有培养方案</h3>
                <p className="text-muted-foreground mb-4">您需要先创建一个培养方案才能添加课程</p>
                <Button onClick={() => router.push("/programs/create")}>创建培养方案</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>课程列表</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索课程..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                      <SelectTrigger className="w-full sm:w-[260px]">
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

                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <Spinner size="lg" />
                    </div>
                  ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-16">
                      <h3 className="text-xl font-medium mb-2">没有课程</h3>
                      <p className="text-muted-foreground mb-4">您尚未添加任何课程，点击添加课程开始记录您的学业进度</p>
                      <Button onClick={handleAddCourse}>添加课程</Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>课程名称</TableHead>
                            <TableHead>学分</TableHead>
                            <TableHead>评分制度</TableHead>
                            <TableHead>成绩/状态</TableHead>
                            <TableHead>GPA</TableHead>
                            <TableHead>所属类别</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCourses.map((course) => (
                            <TableRow key={course.id}>
                              <TableCell className="font-medium">{course.name}</TableCell>
                              <TableCell>{course.credits}</TableCell>
                              <TableCell>{course.grading_system === "percentage" ? "百分制" : "通过/不通过"}</TableCell>
                              <TableCell>
                                {course.grading_system === "percentage" ? (
                                  course.grade ? (
                                    `${course.grade}分`
                                  ) : (
                                    "-"
                                  )
                                ) : (
                                  <Badge variant={course.passed ? "success" : "destructive"}>
                                    {course.passed ? "通过" : "不通过"}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{course.gpa !== null ? course.gpa : "-"}</TableCell>
                              <TableCell>{getCategoryNameById(course.category_id)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleEditCourse(course)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setDeleteId(course.id)}
                                    className="text-destructive"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Course Dialog */}
          <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditMode ? "编辑课程" : "添加课程"}</DialogTitle>
                <DialogDescription>{isEditMode ? "更新课程信息" : "添加一门新课程到您的学业记录中"}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="courseName">课程名称</Label>
                  <Input
                    id="courseName"
                    placeholder="如：数据结构"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseCredits">学分</Label>
                  <Input
                    id="courseCredits"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="如：4"
                    value={courseCredits}
                    onChange={(e) => setCourseCredits(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>评分制度</Label>
                  <Tabs
                    defaultValue={gradingSystem}
                    value={gradingSystem}
                    onValueChange={(value) => setGradingSystem(value as "percentage" | "pass_fail")}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="percentage">百分制</TabsTrigger>
                      <TabsTrigger value="pass_fail">通过/不通过</TabsTrigger>
                    </TabsList>
                    <TabsContent value="percentage" className="pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="grade">成绩（0-100）</Label>
                        <Input
                          id="grade"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="如：85"
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                        />
                        {grade && !isNaN(Number.parseFloat(grade)) && (
                          <div className="text-sm text-muted-foreground">
                            当前GPA：{calculateGPA(Number.parseFloat(grade)).toFixed(3)}
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="pass_fail" className="pt-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="passed" checked={passed} onCheckedChange={setPassed} />
                        <Label htmlFor="passed">{passed ? "通过" : "不通过"}</Label>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">课程类别</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择课程类别" />
                    </SelectTrigger>
                    <SelectContent>
                      {flatCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCourseDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveCourse} disabled={savingCourse}>
                  {savingCourse ? <Spinner size="sm" className="mr-2" /> : null}
                  {isEditMode ? "更新" : "添加"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>确认删除</DialogTitle>
                <DialogDescription>您确定要删除这门课程吗？此操作无法撤销。</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteId(null)}>
                  取消
                </Button>
                <Button variant="destructive" onClick={handleDeleteCourse} disabled={deletingCourse}>
                  {deletingCourse ? <Spinner size="sm" className="mr-2" /> : null}
                  删除
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  )
}
