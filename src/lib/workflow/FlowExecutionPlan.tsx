import { AppNode, AppNodeMissingInputs } from "@/types/appNodes";
import {
  WorkflowExecutionPhase,
  WorkFlowExecutionPlan,
} from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/Registry";

export enum FlowExecutionPlanValidationError {
  INVALID_INPUTS = "INVALID_INPUTS",
  NO_ENTRY_POINT = "NO_ENTRY_POINT",
}
type FlowExecutionPlan = {
  executionPlan?: WorkFlowExecutionPlan;
  error?: {
    type: FlowExecutionPlanValidationError;
    invalidElements?: AppNodeMissingInputs[];
  };
};
export const FlowExecutionPlan = (
  nodes: AppNode[],
  edges: Edge[]
): FlowExecutionPlan => {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );
  if (!entryPoint) {
    return {
      error: {
        type: FlowExecutionPlanValidationError.NO_ENTRY_POINT,
      },
    };
  }
  const inputsWitErrors: AppNodeMissingInputs[] = [];
  const planned = new Set<string>();
  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0) {
    inputsWitErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }
  const executionPlan: WorkFlowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];
  planned.add(entryPoint.id);
  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPhase = {
      phase,
      nodes: [],
    };
    for (const currenNode of nodes) {
      if (planned.has(currenNode.id)) {
        continue;
      }
      const inValidInputs = getInvalidInputs(currenNode, edges, planned);
      if (inValidInputs.length > 0) {
        const incomers = getIncomers(currenNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          //If as all the incomer/edges are planned and there are still invalid inouts
          //this means that this particular node is not ready to be executed has invalid inputs
          //which means that workflow is invalid
          //   console.error("Invalid workflow", currenNode.id, inValidInputs);
          inputsWitErrors.push({
            nodeId: currenNode.id,
            inputs: inValidInputs,
          });
        } else {
          continue;
        }
      }
      nextPhase.nodes.push(currenNode);
    }
    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }
  if (inputsWitErrors.length > 0) {
    return {
      error: {
        type: FlowExecutionPlanValidationError.INVALID_INPUTS,
        invalidElements: inputsWitErrors,
      },
    };
  }
  return { executionPlan };
};

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;
  for (const input of inputs) {
    const inputValue = node.data.inputs[input.name];
    console.log("inputValue of", input.name, inputValue);
    const inputValuedProvided = inputValue?.length > 0;
    if (inputValuedProvided) {
      continue;
    }
    const incomingEdges = edges.filter((edge) => edge.target === node.id);
    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );
    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);
    if (requiredInputProvidedByVisitedOutput) {
      //the input is required and it is provided by a visited output / already planned
      continue;
    } else if (!input.required) {
      if (!inputLinkedToOutput) continue;
      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
        //the output is providing the input and it is already planned
        continue;
      }
    }
    invalidInputs.push(input.name);
  }
  return invalidInputs;
}

function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
  if (!node.id) return [];
  const incomersIds = new Set();
  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomersIds.add(edge.source);
    }
  });
  return nodes.filter((node) => incomersIds.has(node.id));
}
