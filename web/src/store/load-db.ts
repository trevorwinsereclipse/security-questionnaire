import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { server$ } from '@builder.io/qwik-city';
import { sql } from 'drizzle-orm';

const client = new Client({
  host: "web-database-1",
  port: 5432,
  user: "postgres",
  password: "securepassword",
  database: "postgres",
});

// Initialize the Drizzle ORM instance
const db = drizzle(client);

// Define the user_table
const user_table = pgTable('user_table', {
  id: serial('id').primaryKey(),
  username: text('username'),
  password: text('password'),
});

// Define the answer_table with a foreign key to user_table
const answer_table = pgTable('answer_table', {
  id: serial('id').primaryKey(),
  topic: text('topic'),
  col: integer('col'),
  user_id: integer('user_id').references(() => user_table.id), // Foreign key
});

// Function to load answers from the answer_table
export const loadAnswers = server$(async function() {
  try {
    await client.connect();
    const res = await db.select().from(answer_table);
    console.log(res);
  } catch (err) {
    console.error('Error loading answers:', err);
  } finally {
    await client.end(); // Ensure the connection is properly closed
  }
});

// Function to check if a user exists with the given username and password
export const checkUser = server$(async function(username: string, password: string) {
  try {

    await client.connect();
    const res = await db
      .select()
      .from(user_table)
      .where(sql`${user_table.username} = ${username} AND ${user_table.password} = ${password}`);
      
    return res.length > 0; // Return true if user exists, otherwise false
  } catch (err) {
    console.error('Error checking user:', err);
    return false;
  } finally {
    await client.end(); // Ensure the connection is properly closed
  }
});
