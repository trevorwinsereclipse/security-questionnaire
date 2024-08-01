import { component$, useContext } from "@builder.io/qwik";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { ChecklistContext } from "~/store/checklist-context";
import type { Section } from '~/types/PSC';
import { sql } from 'drizzle-orm'

const client = new Client({
  host: "web-database-1",
  port: 5432,
  user: "postgres",
  password: "securepassword",
  database: "postgres",
});

const db = drizzle(client);

await client.connect();

const progressScores = pgTable('progress_scores', {
  id: serial('id').primaryKey(),
  section: text('section'),
  score: jsonb('score'),
});

const saveProgressScore = async (section: string, score: any) => {
  try {
    const existingRecords = await db.select().from(progressScores).where(sql`progress_scores.section = ${section}`).limit(1);
    const existingRecord = existingRecords[0];

    if (existingRecord) {
      await db.update(progressScores).set({ score }).where(sql`progress_scores.section = ${section}`);
    } else {
      await db.insert(progressScores).values({ section, score });
    }
  } catch (err) {
    console.error('Error saving progress score:', err);
  }
};

export default component$(() => {
  const [progressScore] = useLocalStorage('PSC_PROGRESS_SCORE', {});
  const checklists = useContext(ChecklistContext);

  const saveProgress = async () => {
    for (const section of checklists.value) {
      await saveProgressScore(section.title, progressScore.value[section.title] || 0);
    }
  };

  saveProgress();

  return "Hello World!!!";
});
