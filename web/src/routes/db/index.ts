// import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
// import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
  host: "postgres",
  port: 5432,
  user: "user123",
  password: "securepassword",
  database: "postgres",
});

await client.connect();
// const db = drizzle(client);