import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION ?? "eu-west-1",
  ...(process.env.DYNAMODB_ENDPOINT
    ? { endpoint: process.env.DYNAMODB_ENDPOINT } // local dev
    : {}),
});

export const db = DynamoDBDocumentClient.from(client);

export const TABLES = {
  USERS:    process.env.TABLE_USERS    ?? "mindly-users",
  CHECKINS: process.env.TABLE_CHECKINS ?? "mindly-checkins",
};
