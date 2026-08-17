import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Contact, Package, Kanban } from "lucide-react";

const NAV_ITEMS = [
  { to: "/contacts", label: "Contacts", sublabel: "Lvl 1", icon: Contact },
  { to: "/products", label: "Products", sublabel: "Lvl 2", icon: Package },
  { to: "/tasks", label: "Tasks", sublabel: "Lvl 3", icon: Kanban },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 gap-6">
          <h1 className="text-lg font-bold tracking-tight text-primary mr-4">
            Entity Hub
          </h1>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                <span className="hidden sm:inline text-xs text-muted-foreground">
                  {item.sublabel}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
