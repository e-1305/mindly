import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

/**
 * Single place for Bedrock settings.
 * Default region is EU so wellbeing data is processed in the EU (GDPR).
 * Set BEDROCK_MODEL_ID to a Claude model enabled in your account and region.
 */
export const AWS_REGION = process.env.AWS_REGION ?? "eu-west-1";

export const MODEL_ID =
  process.env.BEDROCK_MODEL_ID ?? "anthropic.claude-3-haiku-20240307-v1:0";

export const bedrock = new BedrockRuntimeClient({ region: AWS_REGION });
