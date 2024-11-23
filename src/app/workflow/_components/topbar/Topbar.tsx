"use client";

import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SaveBtn } from "./SaveBtn";
interface Props {
  title?: string;
  subTitle?: string;
  workflowId: number;
}
export default function Topbar({ title, subTitle,workflowId }: Props) {
  const router = useRouter();
  return (
    <header className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky top-0 bg-background z-10">
      <div className="flex gap-1 flex-1">
        <TooltipWrapper content="back">
          <Button variant={"ghost"} size={"icon"} onClick={() => router.back()}>
            <ChevronLeftIcon size={16} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="font-bold text-ellipsis truncate">{title}</p>
          {subTitle && (
            <p className="text-muted-foreground text-xs truncate text-ellipsis">
              {subTitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-1 flex-1 justify-end">
        <SaveBtn workflowId={workflowId}/>
      </div>
    </header>
  );
}
