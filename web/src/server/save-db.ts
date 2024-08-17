import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { sql } from 'drizzle-orm';
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

const client = new Client({
  host: 'web-database-1',
  port: 5432,
  user: 'postgres',
  password: 'securepassword',
  database: 'postgres',
});

const db = drizzle(client);
const user_table = pgTable('user_table', {
    id: serial('id').primaryKey(),
    username: text('username'),
    password: text('password'),
  });
  
  const answer_table = pgTable('answer_table', {
    id: serial('id').primaryKey(),
    topic: text('topic'),
    col: integer('col'),
    user_id: integer('user_id').references(() => user_table.id),
  });

export async function saveAnswers(completed: any) {
  try {
    await client.connect();
    for (const [topic, col] of Object.entries(completed) as [string, number][]) {
      const existingRecords = await db.select().from(answer_table).where(sql`answer_table.topic = ${topic}`).limit(1);
      const existingRecord = existingRecords[0];

      if (existingRecord?.id) {
        await db.update(answer_table).set({ col }).where(sql`answer_table.topic = ${topic}`);
      } else {
        await db.insert(answer_table).values({ topic, col });
      }
    }
  } catch (err) {
    console.error('Error saving answers:', err);
  } finally {
    await client.end();
  }
}
