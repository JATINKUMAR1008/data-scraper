import { waitForDebugger } from "@/lib/helpers/waitFor";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer-core";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
import { env } from "process";
import chromium from "@sparticuz/chromium";

const BROWSER_WS =
  "wss://brd-customer-hl_e382b5c4-zone-scraping_browser1:4vka66lxahar@brd.superproxy.io:9222";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  try {
    const websiteUrl = environment.getInput("Website Url");
    console.log("Launching Browser", websiteUrl);
    let Browser = null;
    const isLocal = process.env.NODE_ENV === "development";
    Browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: isLocal
        ? "/path/to/local/chromium" // Replace with local Chromium path for development
        : await chromium.executablePath(),
      headless: chromium.headless,
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
  } catch (error: any) {
    environment.log.error("Error in LaunchBrowserExecutor " + error.message);
    return false;
  }
}
