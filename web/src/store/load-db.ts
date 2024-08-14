import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { server$ } from '@builder.io/qwik-city';
import { sql } from 'drizzle-orm'

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
const user_table = pgTable('user_table', {
  id: serial('id').primaryKey(),
  username: text('username'),
  password: text('password'),});

export const loadAnswers = server$(async function(){
  try {
    await client.connect();
    const res = await db.select().from(answer_table);
    console.log(res);
  } catch (err) {
    console.error('Error saving loading answers:', err);
  } finally {
      await client.end();
  }
});

export const checkUser = server$(async function(username: string, password: string) {
  try {
    await client.connect();
    const res = await db.select().from(user_table).where(sql`${user_table.username} = ${username} && ${user_table.password} = ${password}`);
    return res[0]? true:false;
  } catch (err) {
    console.error('Error saving loading answers:', err);
  } finally {
      await client.end();
  }
  return false;
});