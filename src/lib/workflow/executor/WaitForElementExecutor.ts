import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
import { WaitForElementTask } from "../task/WaitForElement";

export async function WaitForElementExecutor(
  environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      environment.log.error("input->Selector not defined");
      return false;
    }
    const visibility = environment.getInput("Visibility");
    if (!visibility) {
      environment.log.error("input->Visibility not defined");
      return false;
    }
    await environment.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });
    environment.log.info(`Element ${selector} is ${visibility}`);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
