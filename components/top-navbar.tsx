"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, LayoutDashboard, BookOpen, FolderOpen, BarChart, User, LogOut, Clock, Users } from "lucide-react"
import { CertificateIcon } from "@/components/icons/certificate-icon"

export function TopNavbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Don't show navbar on authentication pages
  if (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") {
    return null
  }

  const navItems = [
    {
      name: "仪表盘",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      active: pathname === "/dashboard",
      requireAuth: true,
    },
    {
      name: "培养方案",
      href: "/programs",
      icon: <FolderOpen className="h-4 w-4" />,
      active: pathname.startsWith("/programs"),
      requireAuth: true,
    },
    {
      name: "课程信息",
      href: "/courses",
      icon: <BookOpen className="h-4 w-4" />,
      active: pathname.startsWith("/courses"),
      requireAuth: true,
    },
    {
      name: "数据统计",
      href: "/statistics",
      icon: <BarChart className="h-4 w-4" />,
      active: pathname === "/statistics",
      requireAuth: true,
    },
    {
      name: "版本时间线",
      href: "/about/timeline",
      icon: <Clock className="h-4 w-4" />,
      active: pathname === "/about/timeline",
      requireAuth: false,
    },
    {
      name: "开发团队",
      href: "/about/developers",
      icon: <Users className="h-4 w-4" />,
      active: pathname === "/about/developers",
      requireAuth: false,
    },
  ]

  // Filter nav items based on authentication status
  const filteredNavItems = navItems.filter((item) => !item.requireAuth || isAuthenticated)

  // Get current page name for mobile dropdown
  const getCurrentPageName = () => {
    const currentItem = filteredNavItems.find((item) => item.active)
    return currentItem ? currentItem.name : "菜单"
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <CertificateIcon className="h-8 w-8 text-primary" />
            <span className="text-lg font-bold text-black">毕业学分审查系统</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-6">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  item.active ? "text-black" : "text-gray-600 hover:text-black"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile navigation dropdown */}
          <div className="lg:hidden">
            <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1 border-gray-200 text-black">
                  <span>{getCurrentPageName()}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {filteredNavItems.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    className={`cursor-pointer ${item.active ? "bg-gray-100" : ""}`}
                    onClick={() => {
                      window.location.href = item.href
                      setMobileMenuOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 text-black hover:bg-gray-100">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => (window.location.href = "/profile")}>
                  <User className="h-4 w-4" />
                  <span>个人信息</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer text-red-600" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : pathname !== "/login" && pathname !== "/register" ? (
            <>
              {/* Mobile dropdown for auth buttons */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      账号
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => (window.location.href = "/login")}>
                      登录
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => (window.location.href = "/register")}>
                      注册
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Desktop auth buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <Button asChild variant="outline">
                  <Link href="/login">登录</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">注册</Link>
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}
