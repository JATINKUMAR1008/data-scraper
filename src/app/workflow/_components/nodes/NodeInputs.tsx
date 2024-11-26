import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import { NodeParamField } from "./NodeParamField";
import { ColorForHanlde } from "./common";
import { useFlowValidation } from "@/hooks/flowValidation";

export const NodeInputs = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};
export const NodeInput = ({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) => {
  const edges = useEdges();
  const { invalidInputs } = useFlowValidation();
  const hasErrors = invalidInputs
    .find((i) => i.nodeId === nodeId)
    ?.inputs.find((i) => i === input.name);
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );
  return (
    <div
      className={cn(
        "flex justify-start relative p-3 bg-secondary w-full",
        hasErrors && "bg-destructive/30"
      )}
    >
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
      {!input.hideHandle && (
        <Handle
          id={input.name}
          isConnectable={!isConnected}
          type="target"
          position={Position.Left}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !size-4",
            ColorForHanlde[input.type]
          )}
        />
      )}
    </div>
  );
};
