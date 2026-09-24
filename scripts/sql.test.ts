import { beforeAll, describe, expect, it } from "vitest";
import initSqlJs, { type SqlJsStatic } from "sql.js";
import { CASES } from "../src/data/cases";
import { CASE_SEEDS } from "../src/data/caseSeeds";
import { TUTORIALS, TRAINING_SEED } from "../src/data/tutorials";
import { CASE_SOLUTIONS, toRows } from "./solutions";

let SQL: SqlJsStatic;

beforeAll(async () => {
  SQL = await initSqlJs();
});

const availableCases = CASES.filter((c) => c.status === "available");

describe("case solvability", () => {
  it("has at least the three launched levels available", () => {
    expect(availableCases.length).toBeGreaterThanOrEqual(3);
  });

  for (const c of availableCases) {
    describe(`Level ${c.id} — ${c.title}`, () => {
      it("has seed data", () => {
        expect(CASE_SEEDS[c.id], `no seed for case ${c.id}`).toBeTruthy();
      });

      for (const obj of c.objectives) {
        describe(`[${obj.id}] ${obj.title}`, () => {
          it("has a canonical solution query", () => {
            expect(CASE_SOLUTIONS[obj.id], `missing solution for ${obj.id}`).toBeTruthy();
          });

          it("canonical solution satisfies the objective", () => {
            const db = new SQL.Database();
            db.run(CASE_SEEDS[c.id]);
            try {
              const rows = toRows(db, CASE_SOLUTIONS[obj.id]);
              expect(obj.validationFn(rows)).toBe(true);
            } finally {
              db.close();
            }
          });

          it("rejects an empty result set", () => {
            // Every validator requires real evidence; no rows must never validate.
            expect(obj.validationFn([])).toBe(false);
          });
        });
      }
    });
  }
});

describe("tutorial exercises", () => {
  const withExercise = TUTORIALS.filter((t) => t.status === "available" && t.exercise);

  it("every available concept ships a practice exercise", () => {
    const available = TUTORIALS.filter((t) => t.status === "available");
    expect(withExercise.length).toBe(available.length);
  });

  for (const t of withExercise) {
    describe(`[tut:${t.id}] ${t.name}`, () => {
      it("solution satisfies the exercise validator", () => {
        const db = new SQL.Database();
        db.run(TRAINING_SEED);
        try {
          const rows = toRows(db, t.exercise!.solution);
          expect(t.exercise!.validationFn(rows)).toBe(true);
        } finally {
          db.close();
        }
      });

      it("rejects an empty result set", () => {
        expect(t.exercise!.validationFn([])).toBe(false);
      });
    });
  }
});

describe("validator strictness", () => {
  it("a bare SELECT * fails a filtered WHERE objective (1-2)", () => {
    const obj = CASES.find((c) => c.id === 1)!.objectives.find((o) => o.id === "1-2")!;
    const db = new SQL.Database();
    db.run(CASE_SEEDS[1]);
    try {
      // 1-2 wants only Salim Ansari's row; the whole table must not validate.
      const allRows = toRows(db, "SELECT * FROM witnesses");
      expect(obj.validationFn(allRows)).toBe(false);
    } finally {
      db.close();
    }
  });
});
