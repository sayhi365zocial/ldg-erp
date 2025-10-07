import Link from "next/link"
import { VERSION, VERSION_DATE, APP_NAME } from "@/lib/version"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} {APP_NAME}</span>
          <span>•</span>
          <Link
            href="/changelog"
            className="hover:text-foreground transition-colors"
          >
            v{VERSION}
          </Link>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{VERSION_DATE}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Built with ❤️ by 365zocial
        </div>
      </div>
    </footer>
  )
}
