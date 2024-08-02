import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { ChecklistContext } from "~/store/checklist-context";
import type { Section } from '~/types/PSC';
import { sql } from 'drizzle-orm';

const client = new Client({
  host: "web-database-1",
  port: 5432,
  user: "postgres",
  password: "securepassword",
  database: "postgres",
});

const db = drizzle(client);

await client.connect();

