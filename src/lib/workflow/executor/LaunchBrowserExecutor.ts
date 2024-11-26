import { waitForDebugger } from "@/lib/helpers/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { env } from "process";
export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");
    console.log("Launching Browser", websiteUrl);
    const Browser = await puppeteer.launch({
      headless: true,
    });
    environment.log.info("Browser started successfully");
    environment.setBrowser(Browser);
    const page = await Browser.newPage();
    await waitForDebugger(3000);
    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Opened page at: ${websiteUrl}`);
    // await Browser.close();
    return true;
  } catch (error:any) {
    environment.log.error("Error in LaunchBrowserExecutor "+ error.message);
    return false;
  }
}
