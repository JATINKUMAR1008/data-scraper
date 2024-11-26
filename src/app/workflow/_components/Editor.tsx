"use client";
import { WorkFlowProps } from "@/app/(dashboard)/workflows/_components/WorkflowCard";
import { ReactFlowProvider } from "@xyflow/react";
import { FlowEditor } from "./FlowEditor";
import Topbar from "./topbar/Topbar";
import { TaskMenu } from "./TaskMenu";
import { FlowValidationProvider } from "@/components/context/FlowValidationContext";
export const Editor = ({ workflow }: { workflow: WorkFlowProps }) => {
  return (
    <FlowValidationProvider>
      <ReactFlowProvider>
        <div className="flex flex-col w-full h-full overflow-hidden">
          <Topbar
            title="Workflow Editor"
            subTitle={workflow.name}
            workflowId={workflow.id}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationProvider>
  );
};
