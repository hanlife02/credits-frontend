"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { trainingProgramApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, Plus, MoreHorizontal, Eye, Trash, BookOpen, Globe } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type TrainingProgram = {
  id: string
  name: string
  total_credits: number
  is_public: boolean
  user_id: string
}

export default function ProgramsPage() {
  const { user } = useAuth()
  const [programs, setPrograms] = useState<TrainingProgram[]>([])
  const [publicPrograms, setPublicPrograms] = useState<TrainingProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        // Get user's programs
        const userPrograms = await trainingProgramApi.getPrograms()
        setPrograms(userPrograms)

        // Get public programs
        const publicProgramsData = await trainingProgramApi.getPrograms({ public_only: true })
        // Filter out programs that are already in user's programs
        const filteredPublicPrograms = publicProgramsData.filter(
          (program: TrainingProgram) => !userPrograms.some((p: TrainingProgram) => p.id === program.id),
        )
        setPublicPrograms(filteredPublicPrograms)
      } catch (err) {
        setError("获取培养方案失败")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleteLoading(true)
    try {
      await trainingProgramApi.deleteProgram(deleteId)
      setPrograms(programs.filter((program) => program.id !== deleteId))
      setDeleteId(null)
    } catch (err) {
      setError("删除培养方案失败")
      console.error(err)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handlePublish = async (id: string, isPublic: boolean) => {
    try {
      await trainingProgramApi.publishProgram(id, isPublic)
      // Update programs list
      setPrograms(programs.map((program) => (program.id === id ? { ...program, is_public: isPublic } : program)))
    } catch (err) {
      setError(isPublic ? "发布培养方案失败" : "取消发布培养方案失败")
      console.error(err)
    }
  }

  return (
    <ProtectedRoute>
      <div className="container py-8">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold">培养方案管理</h1>
            <Button onClick={() => router.push("/programs/create")} className="sm:w-auto w-full">
              <Plus className="mr-2 h-4 w-4" />
              创建培养方案
            </Button>
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
          ) : (
            <>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">我的培养方案</h2>
                  {programs.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-medium mb-2">没有培养方案</h3>
                        <p className="text-muted-foreground mb-4">您尚未创建任何培养方案，点击创建开始规划您的学业</p>
                        <Button onClick={() => router.push("/programs/create")}>创建培养方案</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {programs.map((program) => (
                        <Card key={program.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{program.name}</CardTitle>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => router.push(`/programs/${program.id}`)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    查看详情
                                  </DropdownMenuItem>
                                  {user?.is_admin && (
                                    <DropdownMenuItem onClick={() => handlePublish(program.id, !program.is_public)}>
                                      <Globe className="mr-2 h-4 w-4" />
                                      {program.is_public ? "取消发布" : "发布公开"}
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => setDeleteId(program.id)}
                                    className="text-destructive"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    删除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-muted-foreground mb-2">
                              总学分: <span className="font-medium">{program.total_credits}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {program.is_public && (
                                <Badge variant="secondary" className="px-2 py-0">
                                  <Globe className="mr-1 h-3 w-3" />
                                  公开
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => router.push(`/programs/${program.id}`)}
                            >
                              查看详情
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {publicPrograms.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">公共培养方案</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {publicPrograms.map((program) => (
                        <Card key={program.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{program.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-muted-foreground mb-2">
                              总学分: <span className="font-medium">{program.total_credits}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="px-2 py-0">
                                <Globe className="mr-1 h-3 w-3" />
                                公开
                              </Badge>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => router.push(`/programs/${program.id}`)}
                            >
                              查看详情
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>确认删除</DialogTitle>
                <DialogDescription>
                  您确定要删除这个培养方案吗？此操作无法撤销，相关的课程类别也将被删除。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteId(null)}>
                  取消
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                  {deleteLoading ? <Spinner size="sm" className="mr-2" /> : null}
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
