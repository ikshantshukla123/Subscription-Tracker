import { Client as UpstashWorkflowClient } from "@upstash/workflow";
import { QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY, QSTASH_TOKEN, QSTASH_URL } from "./env.js";


export const workflowClient = new UpstashWorkflowClient({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN,
});
