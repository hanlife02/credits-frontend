import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Github, Globe } from "lucide-react"

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ethan */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Link href="https://hanlife02.com" target="_blank" rel="noopener noreferrer" className="mb-4">
                <img
                  src="https://hanlife02.com/api/v2/objects/avatar/vrkkxm60zb217or1qu.jpg"
                  alt="Ethan"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                />
              </Link>
              <h3 className="text-xl font-bold mb-2">Ethan</h3>
              <p className="text-muted-foreground mb-4">Don't stay awake for too long.</p>
              <div className="flex gap-3">
                <Link
                  href="https://github.com/hanlife02"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Link>
                <Link
                  href="https://hanlife02.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  <Globe className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </div>
            </div>

            {/* Lynn */}
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="mb-4">
                <img
                  src="https://blog-dogecdn.lynn6.cn/pic/fb2c42d74892b1e208c0be7af2be20b31627004540489.jpeg"
                  alt="Lynn"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Lynn</h3>
              <p className="text-muted-foreground mb-4">半生累尽徒然碑文完美有谁看</p>
              <div className="flex gap-3">
                <Link
                  href="https://github.com/LynnGuo666"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Link>
                <Link
                  href="https://blog.lynn6.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  <Globe className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">对系统有任何建议或反馈？请联系我们的开发团队。</p>
      </div>
    </div>
  )
}
