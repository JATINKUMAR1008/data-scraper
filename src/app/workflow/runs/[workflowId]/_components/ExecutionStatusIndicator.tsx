import { cn } from "@/lib/utils";
import { ExecutionStatus } from "@/types/workflow";
import React from "react";

const indicatorColors: Record<ExecutionStatus, string> = {
  PENDING: "bg-slate-400",
  RUNNING: "bg-yellow-400",
  COMPLETED: "bg-emerald-400",
  FAILED: "bg-red-400",
};

const ExecutionStatusIndicator = ({ status }: { status: ExecutionStatus }) => {
  return <div className={cn("size-2 rounded-full", indicatorColors[status])} />;
};

const labelColor: Record<ExecutionStatus, string> = {
  PENDING: "text-slate-400",
  RUNNING: "text-yellow-400",
  COMPLETED: "text-emerald-400",
  FAILED: "text-red-400",
};


export const ExecutionStatusLabel = ({
  status,
}: {
  status: ExecutionStatus;
}) => {
  return <span className={cn("lowercase", labelColor[status])}>{status}</span>;
};

export default ExecutionStatusIndicator;
