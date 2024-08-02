import { useLocalStorage } from "~/hooks/useLocalStorage";
import type { Section, Checklist } from '../../types/PSC';
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const [completed, setCompleted] = useLocalStorage('PSC_PROGRESS', {});

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