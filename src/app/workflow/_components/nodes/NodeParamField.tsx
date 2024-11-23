import { Input } from "@/components/ui/input";
import { TaskParam, TaskParamType } from "@/types/task";
import { StringParams } from "./params/StringParams";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNodes";
import { useCallback } from "react";
import BrowserInstanceParams from "./params/BrowserInstanceParams";

export const NodeParamField = ({
  param,
  nodeId,
}: {
  param: TaskParam;
  nodeId: string;
}) => {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node?.data.inputs?.[param.name] || "";
  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [param.name]: newValue,
        },
      });
    },
    [updateNodeData, param.name, nodeId, node?.data.inputs]
  );
  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParams
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
        />
      );
    case TaskParamType.BROWSER_INSTANCE:
      return <BrowserInstanceParams param={param} value={""} updateNodeParamValue={function (newValue: string): void {
        throw new Error("Function not implemented.");
      } } />;
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented</p>
        </div>
      );
  }
};
