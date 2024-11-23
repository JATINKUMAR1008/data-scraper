import { Logo } from "@/components/Logo";
import { AppProviders } from "@/components/providers/AppProviders";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function WorkflowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <div className="flex flex-col w-full h-screen">
        {children}
        <Separator />
        <footer className="flex items-center justify-between p-2">
          <Logo iconSize={16} fontSize="text-xl" />
        </footer>
      </div>
    </AppProviders>
  );
}
