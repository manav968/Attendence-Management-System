import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Camera, ChartBar, ClipboardList, Home, PlusCircle } from "lucide-react";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/register", label: "Register", icon: PlusCircle },
  { to: "/live", label: "Live", icon: Camera },
  { to: "/dashboard", label: "Dashboard", icon: ChartBar },
  { to: "/reports", label: "Reports", icon: ClipboardList },
];

export function Header() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--secondary))] shadow-sm flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="font-semibold tracking-tight">Amity Attendance</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => cn(
              "px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2",
              isActive && "bg-muted text-foreground",
            )}>
              <n.icon className="h-4 w-4" /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="default">
            <Link to="/live">Start Session</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
