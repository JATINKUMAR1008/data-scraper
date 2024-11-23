import { getWorkflowById } from "@/actions/workflows/getWorkflows";
import { verifySession } from "@/lib/sessions";
import { Editor } from "../../_components/Editor";

export default async function EditorPage({
  params,
}: {
  params: Promise<{
    workflowId: string;
  }>;
}) {
  const { workflowId } = await params;
  const session = verifySession();
  const workflow = await getWorkflowById(workflowId);
  if (!session) {
    return <div>unauthenticated</div>;
  }
  if (!workflow) {
    return <div>Workflow not found</div>;
  }
  return <Editor workflow={workflow} />;
}
