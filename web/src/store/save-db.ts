import { useLocalStorage } from "~/hooks/useLocalStorage";
import type { Section, Checklist } from '../../types/PSC';
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { sql } from 'drizzle-orm';
import { server$ } from '@builder.io/qwik-city';

import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";



const client = new Client({
    host: "web-database-1",
    port: 5432,
    user: "postgres",
    password: "securepassword",
    database: "postgres",
});

const db = drizzle(client);

const answer_table = pgTable('answer_table', {
    id: serial('id').primaryKey(),
    topic: text('topic'),
    column: integer('column'),
});

export const saveAnswers = server$( function(completed) {
    try {
        client.connect();
        
        for (const [topic, column] of Object.entries(completed.value) as [string, number][]) {
            const existingRecords = db.select().from(answer_table).where(sql`answer_table.topic = ${topic}`).limit(1);
            const existingRecord = existingRecords[0];

            if (existingRecord.id) {
                db.update(answer_table).set({ column }).where(sql`answer_table.topic = ${topic}`);
            } else {
                db.insert(answer_table).values({ topic, column });
            }
        }
        console.log("Answers successfully saved.");
    } catch (err) {
        console.error('Error saving progress score:', err);
    } finally {
        client.end();
    }
});

