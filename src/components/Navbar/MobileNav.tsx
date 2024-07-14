"use client";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "../ToggleButtonTheme";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

export default function MobileNavbar() {
  const router = useRouter();
  return (
    <header className="bg-background  py-3 px-6 flex sm:hidden">
      <div className="container mx-auto flex items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:hidden">
            <nav className="grid gap-4 p-4">
              <div
                onClick={() => router.push("/")}
                className="flex items-center cursor-pointer gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground"
              >
                Home
              </div>
              <div
                onClick={() => router.push("/escrow")}
                className="flex items-center cursor-pointer gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground"
              >
                Escrow
              </div>
              <div
                onClick={() => router.push("/history")}
                className="flex items-center cursor-pointer gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted hover:text-foreground"
              >
                History
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex gap-4  p-2 items-center">
        <ThemeToggleButton />
        {/* <WalletMultiButtonFix /> */}
      </div>
    </header>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
