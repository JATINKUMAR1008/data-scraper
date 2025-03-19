import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
import { DeliverViaWebhookTask } from "../task/DeliverWebhook";

export async function WebhookExecutor(
  environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
  try {
    const targetURL = environment.getInput("Target URL");
    if (!targetURL) {
      environment.log.error("input->target URL not defined");
      return false;
    }
    const body = environment.getInput("Body");
    if (!body) {
      environment.log.error("input->body not defined");
      return false;
    }

    const response = await fetch(targetURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const statusCode = response.status;
    if (statusCode !== 200) {
      environment.log.error(`Webhook delivered with status code ${statusCode}`);
      return false;
    }
    const responseBody = await response.json();
    environment.log.info(JSON.stringify(responseBody, null, 4));
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
