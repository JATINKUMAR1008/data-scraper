"use client";

import { WorkFlowProps } from "@/app/(dashborad)/workflows/_components/WorkflowCard";
import { createFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { NodeComponent } from "./nodes/NodeComponent";
import { useCallback, useEffect } from "react";
import { AppNode } from "@/types/appNodes";
import DeletableEdge from "./edges/DeletableEdge";
const nodeTypes = {
  Node: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 2 };
export const FlowEditor = ({ workflow }: { workflow: WorkFlowProps }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition } = useReactFlow();
  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition!);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {
      console.error(error);
    }
  }, [workflow.definition, setNodes, setEdges, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("application/reactflow");
    if (typeof type === undefined || !type) return;
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const newNode = createFlowNode(type as TaskType, position);
    setNodes((prevNodes) => [...prevNodes, newNode]);
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
  }, []);
  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        edgeTypes={edgeTypes}
        fitView
        onDrop={onDrop}
        onConnect={onConnect}
      >
        <Controls
          position="top-left"
          className="stroke-background bg-muted-foreground"
          fitViewOptions={fitViewOptions}
        />
        <Background variant={BackgroundVariant.Dots} gap={12} />
      </ReactFlow>
    </main>
  );
};
