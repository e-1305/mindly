/**
 * Creates local DynamoDB tables and seeds demo users.
 * Run: npx ts-node scripts/seed-local.ts
 */
import { DynamoDBClient, CreateTableCommand, ResourceInUseException } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const client = new DynamoDBClient({ endpoint: "http://localhost:8000", region: "local" });
const db = DynamoDBDocumentClient.from(client);

async function createTable(params: Parameters<typeof client.send>[0] extends { input: infer I } ? I : never) {
  try {
    await client.send(new CreateTableCommand(params as any));
    console.log(`✓ Table created`);
  } catch (e: any) {
    if (e.name === "ResourceInUseException") console.log(`  Table already exists, skipping.`);
    else throw e;
  }
}

async function main() {
  // Users table
  await createTable({
    TableName: "mindly-users",
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [
      { AttributeName: "id",    AttributeType: "S" },
      { AttributeName: "email", AttributeType: "S" },
    ],
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    GlobalSecondaryIndexes: [{
      IndexName: "email-index",
      KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
      Projection: { ProjectionType: "ALL" },
    }],
  });

  // Check-ins table
  await createTable({
    TableName: "mindly-checkins",
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [
      { AttributeName: "id",     AttributeType: "S" },
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "teamId", AttributeType: "S" },
      { AttributeName: "date",   AttributeType: "S" },
    ],
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    GlobalSecondaryIndexes: [
      {
        IndexName: "userId-date-index",
        KeySchema: [
          { AttributeName: "userId", KeyType: "HASH" },
          { AttributeName: "date",   KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
      {
        IndexName: "teamId-date-index",
        KeySchema: [
          { AttributeName: "teamId", KeyType: "HASH" },
          { AttributeName: "date",   KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
    ],
  });

  // Seed users
  const users = [
    { id: "emp-1", name: "Alex Dupont",   email: "alex@company.com",   role: "employee", teamId: "team-1" },
    { id: "mgr-1", name: "Sophie Martin", email: "sophie@company.com", role: "manager",  teamId: "team-1" },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash("password123", 10);
    await db.send(new PutCommand({ TableName: "mindly-users", Item: { ...u, passwordHash } }));
    console.log(`✓ Seeded user: ${u.email} (password: password123)`);
  }

  console.log("\nDone. Start the backend with: npm run dev");
}

main().catch(console.error);
