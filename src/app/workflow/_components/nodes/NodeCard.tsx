import { useFlowValidation } from "@/hooks/flowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import React from "react";

export const NodeCard = ({
  children,
  nodeId,
  isSelected,
}: {
  children: React.ReactNode;
  nodeId: string;
  isSelected: boolean;
}) => {
  const { getNode, setCenter } = useReactFlow();
  const { invalidInputs } = useFlowValidation();
  const hasInvalidInputs = invalidInputs.some((i) => i.nodeId === nodeId);
  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) {
          return;
        }
        const { position, measured } = node;
        if (!position || !measured) {
          return;
        }
        const { width, height } = measured;
        const { x, y } = position;
        if (x === undefined || y === undefined) {
          return;
        }
        setCenter(x + width! / 2, y + height! / 2, {
          zoom: 1,
          duration: 400,
        });
      }}
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-[1px]  flex flex-col",
        isSelected && "border-blue-500",
        hasInvalidInputs && "border-destructive border-2"
      )}
    >
      {children}
    </div>
  );
};
