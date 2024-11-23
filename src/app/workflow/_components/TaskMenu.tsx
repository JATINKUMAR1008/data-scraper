"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/task/Registry";
import { TaskType } from "@/types/task";

export const TaskMenu = () => {
  return (
    <aside className="min-w-[340px] max-w-[340px] w-full border-r-2 border-separate h-full p-2 px-4 overflow-auto">
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["extraction"]}
      >
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data Extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1">
            <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

const TaskMenuBtn = ({ taskType }: { taskType: TaskType }) => {
  const task = TaskRegistry[taskType];
  const onDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    taskType: TaskType
  ) => {
    event.dataTransfer.setData("application/reactflow", taskType);
    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <Button
      variant={"secondary"}
      className="flex justify-between items-center gap-2 w-full border"
      draggable
      onDragStart={(event) => onDragStart(event, taskType)}
    >
      <div className="flex gap-2">
        <task.icon size={16} />
        {task.label}
      </div>
    </Button>
  );
};
