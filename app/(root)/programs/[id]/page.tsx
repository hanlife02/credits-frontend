"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { trainingProgramApi, courseCategoryApi } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, Plus, Edit, Trash, ChevronRight, Globe, ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type TrainingProgram = {
  id: string
  name: string
  total_credits: number
  is_public: boolean
  user_id: string
}

type Category = {
  id: string
  name: string
  required_credits: number
  training_program_id: string
  parent_id: string | null
  subcategories: Category[]
}

export default function ProgramDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const programId = params.id as string

  const [program, setProgram] = useState<TrainingProgram | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Category dialog state
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [categoryName, setCategoryName] = useState("")
  const [categoryCredits, setCategoryCredits] = useState("")
  const [parentCategoryId, setParentCategoryId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [savingCategory, setSavingCategory] = useState(false)

  // Delete dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deletingCategory, setDeletingCategory] = useState(false)

  // Program edit state
  const [showProgramDialog, setShowProgramDialog] = useState(false)
  const [programName, setProgramName] = useState("")
  const [programCredits, setProgramCredits] = useState("")
  const [savingProgram, setSavingProgram] = useState(false)

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        setLoading(true)
        const programData = await trainingProgramApi.getProgram(programId)
        setProgram(programData)
        setProgramName(programData.name)
        setProgramCredits(programData.total_credits.toString())

        const categoriesData = await courseCategoryApi.getProgramCategories(programId)
        setCategories(categoriesData)
      } catch (err) {
        setError("获取培养方案详情失败")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProgramDetails()
  }, [programId])

  const handleAddCategory = (parentId: string | null = null) => {
    setIsEditMode(false)
    setCurrentCategory(null)
    setCategoryName("")
    setCategoryCredits("")
    setParentCategoryId(parentId)
    setShowCategoryDialog(true)
  }

  const handleEditCategory = (category: Category) => {
    setIsEditMode(true)
    setCurrentCategory(category)
    setCategoryName(category.name)
    setCategoryCredits(category.required_credits.toString())
    setParentCategoryId(category.parent_id)
    setShowCategoryDialog(true)
  }

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      setError("请输入类别名称")
      return
    }

    const credits = Number.parseFloat(categoryCredits)
    if (isNaN(credits) || credits <= 0) {
      setError("请输入有效的学分数量")
      return
    }

    setSavingCategory(true)
    try {
      const categoryData = {
        name: categoryName.trim(),
        required_credits: credits,
        training_program_id: programId,
        parent_id: parentCategoryId,
      }

      let updatedCategory
      if (isEditMode && currentCategory) {
        updatedCategory = await courseCategoryApi.updateCategory(currentCategory.id, {
          name: categoryName.trim(),
          required_credits: credits,
        })

        // Update the categories state
        const updateCategoriesRecursively = (cats: Category[]): Category[] => {
          return cats.map((cat) => {
            if (cat.id === currentCategory.id) {
              return { ...cat, name: updatedCategory.name, required_credits: updatedCategory.required_credits }
            }
            if (cat.subcategories && cat.subcategories.length > 0) {
              return { ...cat, subcategories: updateCategoriesRecursively(cat.subcategories) }
            }
            return cat
          })
        }

        setCategories(updateCategoriesRecursively(categories))
      } else {
        updatedCategory = await courseCategoryApi.createCategory(categoryData)

        // Update the categories state
        if (!parentCategoryId) {
          // Top-level category
          setCategories([...categories, { ...updatedCategory, subcategories: [] }])
        } else {
          // Subcategory
          const addSubcategoryRecursively = (cats: Category[]): Category[] => {
            return cats.map((cat) => {
              if (cat.id === parentCategoryId) {
                return {
                  ...cat,
                  subcategories: [...(cat.subcategories || []), { ...updatedCategory, subcategories: [] }],
                }
              }
              if (cat.subcategories && cat.subcategories.length > 0) {
                return { ...cat, subcategories: addSubcategoryRecursively(cat.subcategories) }
              }
              return cat
            })
          }

          setCategories(addSubcategoryRecursively(categories))
        }
      }

      setShowCategoryDialog(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : isEditMode ? "更新类别失败" : "创建类别失败")
    } finally {
      setSavingCategory(false)
    }
  }

  const handleDeleteCategory = async () => {
    if (!deleteId) return

    setDeletingCategory(true)
    try {
      await courseCategoryApi.deleteCategory(deleteId)

      // Update the categories state
      const removeCategoryRecursively = (cats: Category[]): Category[] => {
        return cats.filter((cat) => {
          if (cat.id === deleteId) return false
          if (cat.subcategories && cat.subcategories.length > 0) {
            cat.subcategories = removeCategoryRecursively(cat.subcategories)
          }
          return true
        })
      }

      setCategories(removeCategoryRecursively(categories))
      setDeleteId(null)
    } catch (err) {
      setError("删除类别失败")
      console.error(err)
    } finally {
      setDeletingCategory(false)
    }
  }

  const handleEditProgram = () => {
    setProgramName(program?.name || "")
    setProgramCredits(program?.total_credits.toString() || "")
    setShowProgramDialog(true)
  }

  const handleSaveProgram = async () => {
    if (!programName.trim()) {
      setError("请输入培养方案名称")
      return
    }

    const credits = Number.parseFloat(programCredits)
    if (isNaN(credits) || credits <= 0) {
      setError("请输入有效的学分数量")
      return
    }

    setSavingProgram(true)
    try {
      const updatedProgram = await trainingProgramApi.updateProgram(programId, {
        name: programName.trim(),
        total_credits: credits,
      })

      setProgram(updatedProgram)
      setShowProgramDialog(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新培养方案失败")
    } finally {
      setSavingProgram(false)
    }
  }

  const handlePublishProgram = async (isPublic: boolean) => {
    try {
      const updatedProgram = await trainingProgramApi.publishProgram(programId, isPublic)
      setProgram(updatedProgram)
    } catch (err) {
      setError(isPublic ? "发布培养方案失败" : "取消发布培养方案失败")
      console.error(err)
    }
  }

  const renderCategories = (categoryList: Category[], level = 0) => {
    return categoryList.map((category) => (
      <div key={category.id} className={`ml-${level * 4}`}>
        <div
          className={`p-4 border rounded-lg mb-2 ${
            level === 0 ? "bg-gray-50" : level === 1 ? "bg-gray-100" : "bg-white"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-muted-foreground">学分要求: {category.required_credits}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleAddCategory(category.id)}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteId(category.id)} className="text-destructive">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="ml-4 pl-4 border-l border-gray-200">
            {renderCategories(category.subcategories, level + 1)}
          </div>
        )}
      </div>
    ))
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container py-8 flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </ProtectedRoute>
    )
  }

  if (!program) {
    return (
      <ProtectedRoute>
        <div className="container py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>培养方案不存在或您没有权限查看</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => router.push("/programs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回培养方案列表
          </Button>
        </div>
      </ProtectedRoute>
    )
  }

  const isOwner = user?.id === program.user_id

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => router.push("/programs")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold">{program.name}</h1>
              {program.is_public && (
                <Badge variant="secondary" className="ml-2">
                  <Globe className="mr-1 h-3 w-3" />
                  公开
                </Badge>
              )}
            </div>
            {isOwner && (
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleEditProgram}>
                  <Edit className="mr-2 h-4 w-4" />
                  编辑方案
                </Button>
                {user?.is_admin && (
                  <Button
                    variant={program.is_public ? "destructive" : "outline"}
                    onClick={() => handlePublishProgram(!program.is_public)}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    {program.is_public ? "取消发布" : "发布公开"}
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>课程类别</CardTitle>
                {isOwner && (
                  <Button size="sm" onClick={() => handleAddCategory(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    添加类别
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {categories.length === 0 ? (
                  <div className="text-center py-8">
                    <h3 className="text-xl font-medium mb-2">没有课程类别</h3>
                    <p className="text-muted-foreground mb-4">
                      {isOwner
                        ? "您尚未添加任何课程类别，点击添加类别开始构建您的培养方案"
                        : "该培养方案尚未添加任何课程类别"}
                    </p>
                    {isOwner && <Button onClick={() => handleAddCategory(null)}>添加类别</Button>}
                  </div>
                ) : (
                  <div className="space-y-2">{renderCategories(categories)}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>培养方案信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">总学分要求</h3>
                  <p className="text-2xl font-bold">{program.total_credits}</p>
                </div>
                <div>
                  <h3 className="font-medium">类别数量</h3>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
                {!isOwner && (
                  <div>
                    <h3 className="font-medium">创建者</h3>
                    <p className="text-muted-foreground">管理员</p>
                  </div>
                )}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/dashboard?program=${program.id}`)}
                  >
                    <ChevronRight className="mr-2 h-4 w-4" />
                    查看学分进度
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Dialog */}
          <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{isEditMode ? "编辑类别" : "添加类别"}</DialogTitle>
                <DialogDescription>
                  {isEditMode ? "更新课程类别信息" : parentCategoryId ? "添加子类别" : "添加一个新的顶级课程类别"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">类别名称</Label>
                  <Input
                    id="categoryName"
                    placeholder="如：专业必修课"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryCredits">学分要求</Label>
                  <Input
                    id="categoryCredits"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="如：30"
                    value={categoryCredits}
                    onChange={(e) => setCategoryCredits(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveCategory} disabled={savingCategory}>
                  {savingCategory ? <Spinner size="sm" className="mr-2" /> : null}
                  {isEditMode ? "更新" : "添加"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Program Edit Dialog */}
          <Dialog open={showProgramDialog} onOpenChange={setShowProgramDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑培养方案</DialogTitle>
                <DialogDescription>更新培养方案的基本信息</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="programName">方案名称</Label>
                  <Input
                    id="programName"
                    placeholder="如：计算机科学与技术"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="programCredits">总学分要求</Label>
                  <Input
                    id="programCredits"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="如：120"
                    value={programCredits}
                    onChange={(e) => setProgramCredits(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowProgramDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleSaveProgram} disabled={savingProgram}>
                  {savingProgram ? <Spinner size="sm" className="mr-2" /> : null}
                  更新
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>确认删除</DialogTitle>
                <DialogDescription>您确定要删除这个类别吗？此操作无法撤销，相关的子类别也将被删除。</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteId(null)}>
                  取消
                </Button>
                <Button variant="destructive" onClick={handleDeleteCategory} disabled={deletingCategory}>
                  {deletingCategory ? <Spinner size="sm" className="mr-2" /> : null}
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
