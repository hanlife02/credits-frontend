import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} 毕业学分审查系统. 保留所有权利.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/about/timeline"
            className="text-sm font-medium underline underline-offset-4 text-muted-foreground hover:text-foreground"
          >
            版本时间线
          </Link>
          <Link
            href="/about/developers"
            className="text-sm font-medium underline underline-offset-4 text-muted-foreground hover:text-foreground"
          >
            开发团队
          </Link>
        </div>
      </div>
    </footer>
  )
}
