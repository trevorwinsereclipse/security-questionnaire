import { component$, useContext, useTask$ } from "@builder.io/qwik";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
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



// const answer_table = pgTable('answer_table', {
//   id: serial('id').primaryKey(),
//   topic: text('topic'),
//   column: integer('column'),
// });

export const loadAnswers = async () => {
  try {
    await client.connect();
    const query = 'SELECT * FROM answer_table;'
    const res = await client.query(query);
    console.log(res);
  } catch (err) {
    console.error('Error saving progress score:', err);
  } finally {
      await client.end();
  }
}