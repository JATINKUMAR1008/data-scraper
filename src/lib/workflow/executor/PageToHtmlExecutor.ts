import { waitForDebugger } from "@/lib/helpers/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { PageToHtmlTask } from "../task/PageToHtml";
export async function PageToHtmlExecutor(
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
): Promise<boolean> {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutputs("HTML", html);
    console.log("HTML", html);
    return true;
  } catch (error: any) {
    environment.log.error("Error in LaunchBrowserExecutor " + error.message);
    return false;
  }
}
