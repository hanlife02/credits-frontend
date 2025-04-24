import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Code, Users } from "lucide-react"

export default function DevelopersPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">开发团队</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            开发人员信息
          </CardTitle>
          <CardDescription>毕业学分审查系统的开发团队成员</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Code className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">开发团队信息即将更新</h3>
            <p className="text-muted-foreground max-w-md">
              我们正在整理开发团队的详细信息，敬请期待更新。团队成员信息将包括开发者姓名、角色和贡献。
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">对系统有任何建议或反馈？请联系我们的开发团队。</p>
      </div>
    </div>
  )
}
