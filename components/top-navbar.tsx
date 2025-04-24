"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, GraduationCap, LayoutDashboard, BookOpen, FolderOpen, BarChart, User, LogOut } from "lucide-react"

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
    },
    {
      name: "培养方案",
      href: "/programs",
      icon: <FolderOpen className="h-4 w-4" />,
      active: pathname.startsWith("/programs"),
    },
    {
      name: "课程信息",
      href: "/courses",
      icon: <BookOpen className="h-4 w-4" />,
      active: pathname.startsWith("/courses"),
    },
    {
      name: "数据统计",
      href: "/statistics",
      icon: <BarChart className="h-4 w-4" />,
      active: pathname === "/statistics",
    },
  ]

  // Get current page name for mobile dropdown
  const getCurrentPageName = () => {
    const currentItem = navItems.find((item) => item.active)
    return currentItem ? currentItem.name : "菜单"
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-black" />
            <span className="text-lg font-bold text-black">毕业学分审查系统</span>
          </Link>

          {/* Desktop navigation */}
          {isAuthenticated && (
            <nav className="hidden lg:flex lg:items-center lg:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    item.active ? "text-black" : "text-gray-600 hover:text-black"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile navigation dropdown */}
          {isAuthenticated && (
            <div className="lg:hidden">
              <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1 border-gray-200 text-black">
                    <span>{getCurrentPageName()}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {navItems.map((item) => (
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
          )}

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
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" className="hidden sm:flex">
                <Link href="/login">登录</Link>
              </Button>
              <Button asChild>
                <Link href="/register">注册</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
