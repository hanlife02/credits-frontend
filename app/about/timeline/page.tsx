import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Clock } from "lucide-react"

export default function TimelinePage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">毕业学分审查系统版本时间线</h1>
      </div>

      <div className="space-y-12">
        {/* Version 2 - In Development */}
        <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-800">
          <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">v2</span>
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">版本 2.0</h2>
              <span className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="h-3 w-3" />
                开发中
              </span>
            </div>
            <p className="text-muted-foreground">预计发布日期: 待定</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>预计功能</CardTitle>
              <CardDescription>毕业学分审查系统的第二个版本，提供更智能的自动化功能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">用户信息增强</h3>
                <ul className="space-y-1 list-disc pl-5">
                  <li>支持选择用户的院系-专业-入学年份</li>
                  <li>支持保存用户选择的培养方案到后端</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">自动成绩获取与匹配</h3>
                <ul className="space-y-1 list-disc pl-5">
                  <li>支持自动爬取成绩（需要输入学号密码）</li>
                  <li>爬取完成后提供页面确认课程匹配和分数正确性</li>
                  <li>爬取成绩后自动匹配课程类别（关键词匹配+手动调整界面）</li>
                  <li>提供课程对照表管理（自定义课程别名与标准课程的映射关系）</li>
                  <li>未匹配课程的智能推荐（根据课程名称相似度推荐培养方案分类）</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">培养方案智能处理</h3>
                <ul className="space-y-1 list-disc pl-5">
                  <li>支持上传培养方案PDF，并AI自动解析</li>
                  <li>创建培养方案时也选择院系-专业-入学年份</li>
                  <li>培养方案以列表形式展示，支持根据院系-专业-入学年份进行筛选</li>
                  <li>培养方案自动匹配：院系和专业相同，年份匹配最近且不晚于入学年份</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1 text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 px-3 py-1 rounded-full">
              <Clock className="h-3.5 w-3.5" />
              <span>自动成绩获取</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 px-3 py-1 rounded-full">
              <Clock className="h-3.5 w-3.5" />
              <span>AI解析培养方案</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 px-3 py-1 rounded-full">
              <Clock className="h-3.5 w-3.5" />
              <span>智能课程匹配</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 px-3 py-1 rounded-full">
              <Clock className="h-3.5 w-3.5" />
              <span>用户信息增强</span>
            </div>
          </div>
        </div>

        {/* Version 1 */}
        <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-800">
          <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">v1</span>
          </div>

          <div className="mb-2">
            <h2 className="text-2xl font-bold">版本 1.0</h2>
            <p className="text-muted-foreground">发布日期: 2025年4月24日</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>功能概述</CardTitle>
              <CardDescription>毕业学分审查系统的首个版本，提供全面的学分管理和审查功能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. 账户认证系统</h3>
                <ul className="space-y-1 list-disc pl-5">
                  <li>邮箱注册时发送验证码进行验证</li>
                  <li>找回密码时通过邮箱验证码验证</li>
                  <li>用户分为普通用户和管理员用户</li>
                  <li>前端仅支持普通用户注册</li>
                  <li>管理员用户通过环境变量配置</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2. 培养方案与课程类别设置</h3>
                <ul className="space-y-1 list-disc pl-5">
                  <li>用户可选择现有培养方案或创建新的培养方案</li>
                  <li>培养方案包含名称（涵盖年份、院系、专业）、毕业总学分和课程类别</li>
                  <li>支持在培养方案下添加课程类别及所需学分</li>
                  <li>课程类别可创建多级子类别，学分要求自下而上累加</li>
                  <li>子类别有独立的学分要求，父类别学分需计算子类别相加</li>
                  <li>用户可选择公共培养方案并继承其课程类别</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3. 培养方案管理</h3>
                <ul className="space-y-1 list-disc pl-5">
                  <li>普通用户只能查看自己创建的和公共的培养方案</li>
                  <li>管理员用户可查看所有用户创建的培养方案</li>
                  <li>管理员可将有效的培养方案发布为公共方案</li>
                  <li>公共方案对所有用户开放使用</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4. 课程信息管理</h3>
                <ul className="space-y-1 list-disc pl-5">
                  <li>用户可手动添加个人课程信息</li>
                  <li>课程信息包括名称、学分数和评分制度</li>
                  <li>支持百分制（计算GPA）和通过/不通过制（仅计入学分）</li>
                  <li>百分制GPA计算公式：GPA = 4 - 3 * (100 - 成绩)² / 1600</li>
                  <li>通过/不通过制只记入学分，不计入GPA</li>
                  <li>总GPA按各课程学分加权平均，保留三位小数</li>
                  <li>课程需关联到已创建的课程类别</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">5. 信息修改规则</h3>
                <ul className="space-y-1 list-disc pl-5">
                  <li>培养方案创建后，普通用户不可修改课程类别和学分数</li>
                  <li>若需修改培养方案，须删除原有方案并创建新方案</li>
                  <li>用户可随时修改自己的课程信息</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">6. 用户界面设计</h3>
                <ul className="space-y-1 list-disc pl-5">
                  <li>采用黑白配色，支持深色和浅色主题</li>
                  <li>首页展示系统介绍和登录/注册入口（无需登录即可访问）</li>
                  <li>登录后可访问以下功能页面：</li>
                  <ul className="space-y-1 list-disc pl-5 mt-1">
                    <li>
                      <strong>培养方案：</strong>用于管理培养方案相关内容
                    </li>
                    <li>
                      <strong>课程信息：</strong>用于增删改查课程信息
                    </li>
                    <li>
                      <strong>仪表盘：</strong>
                      展示总学分要求、已修学分、剩余学分和总GPA，以及各课程类别的学分完成情况（使用绿色和红色标识完成与未完成）
                    </li>
                    <li>
                      <strong>数据统计：</strong>通过图形化方式直观展示学分和GPA信息
                    </li>
                  </ul>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>用户认证</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>培养方案管理</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>课程类别设置</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>课程信息管理</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>GPA计算</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-3 py-1 rounded-full">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>数据可视化</span>
            </div>
          </div>
        </div>

        {/* Future versions placeholder */}
        <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-800">
          <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-700 dark:text-gray-300 text-xs font-bold">...</span>
          </div>

          <div className="mb-2">
            <h2 className="text-2xl font-bold text-gray-400">未来版本</h2>
            <p className="text-muted-foreground">敬请期待更多功能和改进...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
