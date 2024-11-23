import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/Sidebar";
import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { SignedIn } from "@/lib/SignedInProvider";
import { UserButton } from "@/components/UserButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
          <BreadcrumbHeader />

          <div className="gap-1 flex items-center">
            {/* <ModeToggle /> */}
            {/* <SignedIn>
                <UserButton/>
            </SignedIn> */}
            <SignedIn>
              <UserButton/>
            </SignedIn>
          </div>
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="flex-1 container text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
