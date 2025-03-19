import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {
  BrainIcon,
  CodeIcon,
  LucideProps,
  MousePointer2Icon,
  MousePointerClickIcon,
  TextIcon,
} from "lucide-react";

export const ExtractDataWithAITask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: "Extract data with AI",
  icon: (props: LucideProps) => (
    <BrainIcon className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Content",
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: "Credentials",
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: "Prompt",
      type: TaskParamType.STRING,
      variant: "textarea",
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: "Extarcted Data",
      type: TaskParamType.STRING,
    },
  ] as const,
  credits: 5,
} satisfies WorkflowTask;
