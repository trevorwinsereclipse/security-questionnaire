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
  user_id: integer('user_id').references(() => user_table.id), // Foreign key
});

export async function loadAnswers() {
  try {
    await client.connect();
    const res = await db.select().from(answer_table);
    return res;
  } catch (err) {
    console.error('Error loading answers:', err);
    throw err;
  } finally {
    await client.end();
  }
}
