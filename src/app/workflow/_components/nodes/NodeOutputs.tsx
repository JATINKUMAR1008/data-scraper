"use client";
import { TaskParam } from "@/types/task";
import { ReactNode } from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { ColorForHanlde } from "./common";
export function NodeOutputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col  gap-1">{children}</div>;
}
export function NodeOutput({
  output,
  nodeId,
}: {
  output: TaskParam;
  nodeId: string;
}) {
  return (
    <div className="flex justify-end relative p-3 bg-secondary">
      <p className="text-xs text-muted-foreground">{output.name}</p>
      <Handle
        type="source"
        id={output.name}
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-2 !border-background !-right-2 !size-4",
          ColorForHanlde[output.type]
        )}
      />
    </div>
  );
}
