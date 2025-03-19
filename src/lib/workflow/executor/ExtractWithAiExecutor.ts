import { ExecutionEnvironment } from "@/types/executor";
import { ClickElementTask } from "../task/ClickElement";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAI";
import { db } from "@/db";
import { credentialsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/encryption";
import { GoogleGenAI } from "@google/genai";
export async function ExtractDataWithAiExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const credentails = environment.getInput("Credentials");
    if (!credentails) {
      environment.log.error("input->credentials not defined");
      return false;
    }

    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("input->prompt not defined");
      return false;
    }

    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("input->content not defined");
      return false;
    }

    const credential = await db.query.credentialsTable.findFirst({
      where: eq(credentialsTable.id, Number(credentails)),
    });

    if (!credential) {
      environment.log.error("credential not found");
      return false;
    }

    const palinValue = await decrypt(credential.value);
    if (!palinValue) {
      environment.log.error("credential value not found");
      return false;
    }

    console.log("@PLAIN VALUE", palinValue);

    const gai = new GoogleGenAI({
      apiKey: palinValue,
    });

    const response = await gai.models.generateContent({
      model: "gemini-1.5-flash-latest",
      contents: [
        {
          role: "model",
          parts: [
            {
              text: "From the following HTML/text, extract the relevant information and structure it as a JSON object or an array of JSON objects. Each key-value pair in the JSON should represent a meaningful piece of data found in the input if no data is found return an empty array NOTE:give answer in JSON only not markdown.\n\n",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: content,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        temperature: 1,
      },
    });

    environment.log.info(
      `Prompt token: ${response.usageMetadata?.promptTokenCount}`
    );
    environment.log.info(
      `Total token: ${response.usageMetadata?.totalTokenCount}`
    );

    const result = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!result) {
      environment.log.error("No response generated from AI");
      return false;
    }

    environment.setOutputs("Extarcted Data", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
