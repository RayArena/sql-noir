/**
 * SQL verification harness — proves every objective in every "available" case
 * is solvable with a real query against the seed, and that the canonical
 * solution satisfies the objective's validationFn.
 *
 * Run with:  npx tsx scripts/verify-cases.ts
 *
 * SOLUTIONS holds one canonical query per objective id. This doubles as the
 * answer key used by the verification. A missing solution for an available
 * objective is reported as a failure.
 */
import initSqlJs from "sql.js";
import { CASES } from "../src/data/cases";
import { CASE_SEEDS } from "../src/data/caseSeeds";
import { TUTORIALS, TRAINING_SEED } from "../src/data/tutorials";
import { CASE_SOLUTIONS as SOLUTIONS, toRows } from "./solutions";

async function main() {
  const SQL = await initSqlJs();
  let pass = 0;
  let fail = 0;
  const failures: string[] = [];

  for (const c of CASES) {
    if (c.status !== "available") continue;
    const seed = CASE_SEEDS[c.id];
    if (!seed) {
      failures.push(`Case ${c.id} (${c.slug}): no seed data`);
      fail++;
      continue;
    }
    const db = new SQL.Database();
    db.run(seed);

    for (const obj of c.objectives) {
      const sql = SOLUTIONS[obj.id];
      if (!sql) {
        failures.push(`  [${obj.id}] "${obj.title}": NO SOLUTION QUERY`);
        fail++;
        continue;
      }
      try {
        const rows = toRows(db, sql);
        const ok = obj.validationFn(rows);
        const preview = rows.length ? JSON.stringify(rows[0]).slice(0, 90) : "(empty)";
        if (ok) {
          pass++;
          console.log(`  ✓ [${obj.id}] ${obj.title}  (${rows.length} rows) ${preview}`);
        } else {
          fail++;
          failures.push(`  ✗ [${obj.id}] "${obj.title}": ${rows.length} rows, first=${preview} — validationFn rejected`);
        }
      } catch (e) {
        fail++;
        failures.push(`  ✗ [${obj.id}] "${obj.title}": query error — ${(e as Error).message}`);
      }
    }
    db.close();
  }

  // ──────── Tutorial practice exercises (against the shared TRAINING_SEED) ────────
  const tdb = new SQL.Database();
  tdb.run(TRAINING_SEED);
  for (const t of TUTORIALS) {
    if (t.status !== "available" || !t.exercise) continue;
    try {
      const rows = toRows(tdb, t.exercise.solution);
      const ok = t.exercise.validationFn(rows);
      const preview = rows.length ? JSON.stringify(rows[0]).slice(0, 90) : "(empty)";
      if (ok) {
        pass++;
        console.log(`  ✓ [tut:${t.id}] ${t.name}  (${rows.length} rows) ${preview}`);
      } else {
        fail++;
        failures.push(`  ✗ [tut:${t.id}] "${t.name}": ${rows.length} rows, first=${preview} — validationFn rejected`);
      }
    } catch (e) {
      fail++;
      failures.push(`  ✗ [tut:${t.id}] "${t.name}": query error — ${(e as Error).message}`);
    }
  }
  tdb.close();

  console.log(`\n──────── VERIFICATION ${fail === 0 ? "PASSED" : "FAILED"} ────────`);
  console.log(`Passed: ${pass}   Failed: ${fail}`);
  if (failures.length) {
    console.log("\nFailures:");
    failures.forEach((f) => console.log(f));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
