import "dotenv/config";
import { sql } from "./db";

async function main() {
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;

  console.log("Tables in database:");
  tables.forEach((row) => console.log(`- ${row.table_name}`));

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});