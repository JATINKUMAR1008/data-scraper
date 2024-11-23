import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { NodeCard } from "./NodeCard";
import { NodeHeader } from "./NodeHeader";
import { AppNodeData } from "@/types/appNodes";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { NodeInput, NodeInputs } from "./NodeInputs";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";

export const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const task = TaskRegistry[nodeData.type as keyof typeof TaskRegistry];
  return (
    <NodeCard nodeId={props.id} isSelected={props.selected!}>
      <NodeHeader taskType={nodeData.type} />
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput key={input.name} input={input} nodeId={props.id} />
        ))}
      </NodeInputs>
      <NodeOutputs>
        {task.outputs.map((output) => (
          <NodeOutput key={output.name} output={output} nodeId={props.id} />
        ))}
      </NodeOutputs>
    </NodeCard>
  );
});
NodeComponent.displayName = "NodeComponent";
