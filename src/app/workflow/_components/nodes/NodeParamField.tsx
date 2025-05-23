import { Input } from "@/components/ui/input";
import { TaskParam, TaskParamType } from "@/types/task";
import { StringParams } from "./params/StringParams";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNodes";
import { useCallback } from "react";
import BrowserInstanceParams from "./params/BrowserInstanceParams";
import SelectParams from "./params/SelectParam";
import CredentialParams from "./params/CredentialsParams";

export const NodeParamField = ({
  param,
  nodeId,
  disabled,
}: {
  param: TaskParam;
  nodeId: string;
  disabled?: boolean;
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
          disabled={disabled}
        />
      );
    case TaskParamType.BROWSER_INSTANCE:
      return (
        <BrowserInstanceParams
          param={param}
          value={""}
          updateNodeParamValue={function (newValue: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented</p>
        </div>
      );
    case TaskParamType.SELECT:
      return (
        <SelectParams
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case TaskParamType.CREDENTIAL:
      return (
        <CredentialParams
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
  }
};
