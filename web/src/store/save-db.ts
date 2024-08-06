import { useLocalStorage } from "~/hooks/useLocalStorage";
import type { Section, Checklist } from '../../types/PSC';
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { sql } from 'drizzle-orm';
import { server$ } from '@builder.io/qwik-city';
import { pgTable, pgSchema, serial, text, integer } from "drizzle-orm/pg-core";

const client = new Client({
    host: "web-database-1",
    port: 5432,
    user: "postgres",
    password: "securepassword",
    database: "postgres",
});

const db = drizzle(client);

export const mySchema = pgSchema("my_schema");

export const colors = mySchema.enum('colors', ['red', 'green', 'blue']);

export const answer_table = mySchema.table('answer_table', {
    id: serial('id').primaryKey(),
    topic: text('topic'),
    column: integer('column'),
  });


export const saveAnswers = server$(async function(completed) {
    try {
        await client.connect();
        
        for (const [topic, column] of Object.entries(completed.value) as [string, number][]) {
            const existingRecords = await db.select().from(answer_table).where(sql`answer_table.topic = ${topic}`).limit(1);
            const existingRecord = existingRecords[0];

            if (existingRecord.id) {
                await db.update(answer_table).set({ column }).where(sql`answer_table.topic = ${topic}`);
            } else {
                await db.insert(answer_table).values({ topic, column });
            }
        }
        console.log("Answers successfully saved.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
});
