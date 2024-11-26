import { LucideProps } from "lucide-react";
import React from "react";
import { TaskParam, TaskType } from "./task";
import { AppNode } from "./appNodes";

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
  label: string;
  icon: React.FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
  credits: number;
};

export type WorkFlowExecutionPlan = {
  phase: number;
  nodes: AppNode[];
}[];
export type WorkflowExecutionPhase = {
  phase: number;
  nodes: AppNode[];
};

export enum ExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
export enum ExecutionPhaseStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CREATED = "CREATED",
}
export enum WorkflowExecutionTrigger {
  MANUAL = "MANUAL",
  SCHEDULED = "SCHEDULED",
}
