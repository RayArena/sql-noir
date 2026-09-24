/**
 * TUTORIALS — the SQL Academy for THE BLACK LEDGER CONSPIRACY.
 *
 * A data-driven curriculum: 16 concepts, two per case level, taught in the same
 * order the cases teach them. Each concept has lesson content (prose + worked
 * examples) and a hands-on practice exercise run against a shared sandbox
 * database (TRAINING_SEED) using the same sql.js engine and SqlTerminal the
 * cases use. Every "available" exercise's canonical solution is verified against
 * the sandbox by scripts/verify-cases.ts.
 *
 * Concepts for Levels 1–3 (SELECT, WHERE, ORDER BY, LIMIT, DISTINCT, Aggregates)
 * ship complete. Levels 4–8 concepts are "coming-soon" until those cases ship.
 */

// ── Shared practice sandbox — the "Training Dossier" ──────────────────────────
// Small enough to reason about, noir-flavoured, distinct from the real case
// tables so learners know it is a sandbox.
export const TRAINING_SEED = `
CREATE TABLE suspects (
  suspect_id INTEGER PRIMARY KEY,
  alias TEXT,
  home_city TEXT,
  age INTEGER,
  heat INTEGER,
  status TEXT
);
INSERT INTO suspects VALUES
(1,'The Accountant','Devgarh',47,5,'At Large'),
(2,'Nightjar','Devgarh',33,4,'At Large'),
(3,'Copper Anna','Konkan Port',51,2,'Informant'),
(4,'The Ferryman','Devgarh',44,3,'In Custody'),
(5,'Silk','Kadambari',29,4,'At Large'),
(6,'Old Munshi','Devgarh',60,5,'At Large'),
(7,'Rekha the Pen','Civil Lines',38,1,'Informant'),
(8,'Gopal Teen','Raj Nagar',26,2,'In Custody'),
(9,'The Stencil','Konkan Port',41,3,'At Large'),
(10,'Bhau','Nizam Colony',55,4,'In Custody');

CREATE TABLE crimes (
  crime_id INTEGER PRIMARY KEY,
  alias TEXT,
  category TEXT,
  city TEXT,
  loot_inr INTEGER,
  year INTEGER
);
INSERT INTO crimes VALUES
(1,'The Accountant','Fraud','Devgarh',4500000,2023),
(2,'Nightjar','Smuggling','Devgarh',1200000,2024),
(3,'The Accountant','Bribery','Devgarh',800000,2024),
(4,'Silk','Smuggling','Kadambari',2300000,2023),
(5,'The Ferryman','Smuggling','Devgarh',600000,2024),
(6,'Old Munshi','Forgery','Devgarh',150000,2022),
(7,'The Stencil','Smuggling','Konkan Port',3100000,2024),
(8,'Bhau','Extortion','Nizam Colony',900000,2023),
(9,'Nightjar','Arson','Devgarh',0,2024),
(10,'Silk','Fraud','Kadambari',1750000,2024),
(11,'The Stencil','Bribery','Konkan Port',250000,2023),
(12,'Gopal Teen','Theft','Raj Nagar',75000,2022);
`;

// ── Validation helpers (mirror the case validators, scoped to tutorials) ──────
type Row = Record<string, unknown>;
const norm = (v: unknown): string => String(v ?? "").trim().toLowerCase();
const rowText = (r: Row): string => Object.values(r).map(norm).join(" | ");
const countIs = (rows: Row[], n: number): boolean => rows.length === n;
const everyRowHas = (rows: Row[], sub: string): boolean =>
  rows.length > 0 && rows.every((r) => rowText(r).includes(sub.toLowerCase()));
const hasColumns = (rows: Row[], cols: string[]): boolean =>
  rows.length > 0 && cols.every((c) => c in rows[0]);
const isSorted = (rows: Row[], col: string, dir: "asc" | "desc"): boolean => {
  if (rows.length === 0) return false;
  const vals = rows.map((r) => r[col]);
  if (vals.some((v) => v === undefined)) return false;
  for (let i = 1; i < vals.length; i++) {
    const a = vals[i - 1], b = vals[i];
    const cmp = typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b));
    if (dir === "asc" && cmp > 0) return false;
    if (dir === "desc" && cmp < 0) return false;
  }
  return true;
};
const scalarIs = (rows: Row[], expected: number): boolean =>
  rows.length === 1 && Object.values(rows[0]).some((v) => Number(v) === expected);
const allDistinct = (rows: Row[]): boolean => {
  const seen = new Set(rows.map(rowText));
  return rows.length > 0 && seen.size === rows.length;
};
const everyRowNumAtLeast = (rows: Row[], col: string, min: number): boolean =>
  rows.length > 0 && rows.every((r) => Number(r[col]) >= min);

// ── Types ─────────────────────────────────────────────────────────────────────
export type LessonBlock =
  | { kind: "text"; body: string }
  | { kind: "code"; body: string; caption?: string }
  | { kind: "tip"; body: string }
  | { kind: "warning"; body: string };

export interface PracticeExercise {
  prompt: string;
  hint: string;
  /** Canonical answer used by the verifier and revealable to the learner. */
  solution: string;
  validationFn: (rows: Record<string, unknown>[]) => boolean;
  successMessage: string;
}

export interface TutorialConcept {
  /** URL slug and stable id. */
  id: string;
  name: string;
  /** Case level this concept belongs to (1–8). */
  level: number;
  /** SQL keyword badge, e.g. "SELECT". */
  keyword: string;
  status: "available" | "coming-soon";
  tagline: string;
  blocks: LessonBlock[];
  exercise?: PracticeExercise;
}

// ── PLACEHOLDER_CONCEPTS ──
export const TUTORIALS: TutorialConcept[] = [
  // ═══ LEVEL 1 — SELECT, WHERE ═══
  {
    id: "select",
    name: "SELECT",
    level: 1,
    keyword: "SELECT",
    status: "available",
    tagline: "Reading records out of a table.",
    blocks: [
      { kind: "text", body: "Every investigation starts by reading the files. In SQL, you read rows from a table with a SELECT statement. It answers one question: which columns, from which table?" },
      { kind: "code", body: "SELECT * FROM suspects;", caption: "The * means 'every column'. This returns all columns for every row in the suspects table." },
      { kind: "text", body: "Often you only want a few columns. List them by name, separated by commas, in place of the *:" },
      { kind: "code", body: "SELECT alias, home_city FROM suspects;", caption: "Returns just two columns — the alias and home city — for every suspect." },
      { kind: "tip", body: "In the Evidence Terminal you explore with plain SELECT, but to submit an answer you wrap it: submit(SELECT * FROM suspects). Try running the query first, then submit it." },
    ],
    exercise: {
      prompt: "Pull the entire suspect roster. Return all columns for every suspect in the sandbox.",
      hint: "SELECT * FROM suspects — then submit it with submit(...).",
      solution: "SELECT * FROM suspects",
      validationFn: (rows) => countIs(rows, 10) && hasColumns(rows, ["alias", "home_city"]),
      successMessage: "Ten suspects, every column. That's the whole roster.",
    },
  },
  {
    id: "where",
    name: "WHERE",
    level: 1,
    keyword: "WHERE",
    status: "available",
    tagline: "Filtering rows down to the ones that matter.",
    blocks: [
      { kind: "text", body: "A registry of thousands is useless until you can filter it. WHERE keeps only the rows that satisfy a condition." },
      { kind: "code", body: "SELECT * FROM suspects WHERE status = 'At Large';", caption: "Text values go in single quotes. Only rows whose status is exactly 'At Large' come back." },
      { kind: "text", body: "Conditions use =, <>, <, >, <=, >= for comparison, and you can combine them with AND and OR:" },
      { kind: "code", body: "SELECT * FROM suspects WHERE heat >= 4 AND home_city = 'Devgarh';", caption: "Numbers are written bare — no quotes. AND requires both conditions to hold." },
      { kind: "warning", body: "SQL string matching with = is case-sensitive on values: 'at large' will not match 'At Large'. Match the data exactly." },
    ],
    exercise: {
      prompt: "Find every suspect who is still 'At Large'. Return all columns.",
      hint: "SELECT * FROM suspects WHERE status = 'At Large'.",
      solution: "SELECT * FROM suspects WHERE status = 'At Large'",
      validationFn: (rows) => countIs(rows, 5) && everyRowHas(rows, "at large"),
      successMessage: "Five still on the streets. Those are the ones to watch.",
    },
  },
  // ═══ LEVEL 2 — ORDER BY, LIMIT ═══
  {
    id: "order-by",
    name: "ORDER BY",
    level: 2,
    keyword: "ORDER BY",
    status: "available",
    tagline: "Sorting the results into a meaningful order.",
    blocks: [
      { kind: "text", body: "Rows come back in no guaranteed order. ORDER BY sorts them by a column — ascending by default (ASC), or descending with DESC." },
      { kind: "code", body: "SELECT * FROM suspects ORDER BY age DESC;", caption: "Oldest suspect first. Drop DESC (or write ASC) to sort youngest first." },
      { kind: "text", body: "You can sort by more than one column. Ties in the first are broken by the second:" },
      { kind: "code", body: "SELECT * FROM suspects ORDER BY heat DESC, age ASC;", caption: "Highest heat first; among equal heat, youngest first." },
      { kind: "tip", body: "Dates and times stored as ISO text (YYYY-MM-DD) sort chronologically with a plain ORDER BY — no date functions needed." },
    ],
    exercise: {
      prompt: "List the suspects from oldest to youngest. Return all columns, sorted by age descending.",
      hint: "SELECT * FROM suspects ORDER BY age DESC.",
      solution: "SELECT * FROM suspects ORDER BY age DESC",
      validationFn: (rows) => countIs(rows, 10) && isSorted(rows, "age", "desc"),
      successMessage: "Old Munshi at the top, sixty years old. Age before treachery.",
    },
  },
  {
    id: "limit",
    name: "LIMIT",
    level: 2,
    keyword: "LIMIT",
    status: "available",
    tagline: "Taking only the top few rows.",
    blocks: [
      { kind: "text", body: "Once results are sorted, LIMIT skims the top N off the pile — the biggest, the newest, the worst offenders." },
      { kind: "code", body: "SELECT * FROM suspects ORDER BY heat DESC LIMIT 3;", caption: "The three highest-heat suspects. LIMIT almost always follows an ORDER BY — otherwise 'top' means nothing." },
      { kind: "warning", body: "LIMIT without ORDER BY just returns whatever rows the engine reaches first. If you want the 'top' or 'largest', sort first, then limit." },
    ],
    exercise: {
      prompt: "Show the three most dangerous suspects — the highest heat. Return all columns.",
      hint: "ORDER BY heat DESC LIMIT 3.",
      solution: "SELECT * FROM suspects ORDER BY heat DESC LIMIT 3",
      validationFn: (rows) => countIs(rows, 3) && everyRowNumAtLeast(rows, "heat", 4),
      successMessage: "The top three, all heat four or five. The department's most wanted.",
    },
  },
  // ═══ LEVEL 3 — DISTINCT, Aggregates ═══
  {
    id: "distinct",
    name: "DISTINCT",
    level: 3,
    keyword: "DISTINCT",
    status: "available",
    tagline: "Stripping duplicate rows out of a result.",
    blocks: [
      { kind: "text", body: "Ten suspects, but how many different cities? DISTINCT removes duplicate rows so you see each unique value once." },
      { kind: "code", body: "SELECT DISTINCT home_city FROM suspects;", caption: "Each city appears exactly once, no matter how many suspects live there." },
      { kind: "tip", body: "DISTINCT applies to the whole selected row. SELECT DISTINCT city, year gives unique city+year pairs, not unique cities." },
    ],
    exercise: {
      prompt: "List the distinct home cities the suspects come from — each city once.",
      hint: "SELECT DISTINCT home_city FROM suspects.",
      solution: "SELECT DISTINCT home_city FROM suspects",
      validationFn: (rows) => countIs(rows, 6) && allDistinct(rows),
      successMessage: "Six cities feed this network. The map is bigger than it looked.",
    },
  },
  {
    id: "aggregates",
    name: "Aggregate Functions",
    level: 3,
    keyword: "COUNT / SUM / AVG",
    status: "available",
    tagline: "Collapsing many rows into one number.",
    blocks: [
      { kind: "text", body: "Aggregate functions take a whole column and return a single figure: COUNT (how many), SUM (total), AVG (average), MIN and MAX (smallest and largest)." },
      { kind: "code", body: "SELECT COUNT(*) FROM crimes;\nSELECT SUM(loot_inr) FROM crimes;\nSELECT MAX(loot_inr) FROM crimes;", caption: "COUNT(*) counts rows; SUM/AVG/MIN/MAX operate on a numeric column." },
      { kind: "text", body: "Combine an aggregate with WHERE to summarise a slice of the data:" },
      { kind: "code", body: "SELECT COUNT(*) FROM crimes WHERE category = 'Smuggling';", caption: "How many smuggling jobs are on file." },
      { kind: "tip", body: "COUNT(DISTINCT category) counts how many different categories exist — aggregates and DISTINCT combine." },
    ],
    exercise: {
      prompt: "Total the loot across every crime on file. Return the sum of loot_inr.",
      hint: "SELECT SUM(loot_inr) FROM crimes.",
      solution: "SELECT SUM(loot_inr) FROM crimes",
      validationFn: (rows) => scalarIs(rows, 15625000),
      successMessage: "Over one and a half crore in stolen value. This is organised, not opportunistic.",
    },
  },
  // ═══ LEVEL 4 — GROUP BY, HAVING ═══
  {
    id: "group-by",
    name: "GROUP BY",
    level: 4,
    keyword: "GROUP BY",
    status: "available",
    tagline: "Bucketing rows to summarise each group.",
    blocks: [
      { kind: "text", body: "An aggregate like COUNT(*) collapses a whole table into one number. GROUP BY collapses it one bucket at a time instead — one summary row per distinct value of the grouping column." },
      { kind: "code", body: "SELECT category, COUNT(*) FROM crimes GROUP BY category;", caption: "One row per category, each with its own count. The aggregate is computed within each group." },
      { kind: "text", body: "Any aggregate works per group — SUM, AVG, MIN, MAX — and you can filter the rows before grouping with WHERE:" },
      { kind: "code", body: "SELECT city, SUM(loot_inr) FROM crimes WHERE year = 2024 GROUP BY city;", caption: "WHERE trims the rows first; GROUP BY then buckets what's left and totals each city." },
      { kind: "tip", body: "Every column in the SELECT that isn't inside an aggregate must appear in the GROUP BY — otherwise SQLite can't decide which row's value to show." },
    ],
    exercise: {
      prompt: "Count how many crimes fall into each category. Return one row per category with its count.",
      hint: "SELECT category, COUNT(*) FROM crimes GROUP BY category.",
      solution: "SELECT category, COUNT(*) FROM crimes GROUP BY category",
      validationFn: (rows) => countIs(rows, 7),
      successMessage: "Seven categories of crime in the dossier — smuggling runs the longest.",
    },
  },
  {
    id: "having",
    name: "HAVING",
    level: 4,
    keyword: "HAVING",
    status: "available",
    tagline: "Filtering the groups after aggregation.",
    blocks: [
      { kind: "text", body: "WHERE filters individual rows before they are grouped. But what if you want to filter the groups themselves — keep only the categories with more than three crimes? That's what HAVING is for: it filters after GROUP BY, and it can see the aggregates." },
      { kind: "code", body: "SELECT city, COUNT(*) FROM crimes GROUP BY city HAVING COUNT(*) > 2;", caption: "Group by city, then discard any group whose count isn't greater than two." },
      { kind: "text", body: "The rule of thumb: WHERE for raw rows, HAVING for group totals. You can use both in one query — WHERE runs first, then GROUP BY, then HAVING." },
      { kind: "code", body: "SELECT alias, SUM(loot_inr) FROM crimes WHERE year >= 2023 GROUP BY alias HAVING SUM(loot_inr) > 2000000;", caption: "Recent crimes only, grouped per alias, keeping only the big earners." },
      { kind: "warning", body: "You can't put an aggregate in WHERE — 'WHERE COUNT(*) > 2' is an error. Aggregated conditions belong in HAVING." },
    ],
    exercise: {
      prompt: "Which cities have more than two crimes on file? Group by city and keep only the busy ones.",
      hint: "SELECT city, COUNT(*) FROM crimes GROUP BY city HAVING COUNT(*) > 2.",
      solution: "SELECT city, COUNT(*) FROM crimes GROUP BY city HAVING COUNT(*) > 2",
      validationFn: (rows) => countIs(rows, 1) && everyRowHas(rows, "devgarh"),
      successMessage: "Only Devgarh clears the bar — six crimes in a single city.",
    },
  },
  { id: "inner-join", name: "INNER JOIN", level: 5, keyword: "INNER JOIN",
    status: "available", tagline: "Matching rows across two tables.",
    blocks: [
      { kind: "text", body: "So far every query has read one table. But evidence is scattered across many — suspects in one, their crimes in another. A JOIN reads two tables at once, stitching their rows together wherever a shared value matches." },
      { kind: "code", body: "SELECT s.alias, c.category\nFROM suspects s\nJOIN crimes c ON s.alias = c.alias;", caption: "Pair each suspect with each crime that shares their alias. The ON clause is the matching rule." },
      { kind: "text", body: "The letters s and c are table aliases — short nicknames so you can write s.alias instead of suspects.alias. An INNER JOIN (plain JOIN) keeps only rows that match on both sides: a suspect with no crime, or a crime with no suspect, simply drops out." },
      { kind: "code", body: "SELECT c.category, c.loot_inr, s.heat\nFROM crimes c\nJOIN suspects s ON c.alias = s.alias\nWHERE s.home_city = 'Devgarh';", caption: "Columns from both tables in one result — loot from crimes, heat from suspects — filtered by a suspects column." },
      { kind: "tip", body: "Qualify columns with their table alias (s.alias, c.alias) whenever a name appears in both tables — otherwise SQLite can't tell which one you mean." },
    ],
    exercise: {
      prompt: "Match every crime to the suspect who committed it, joining on alias. Show each crime's loot (loot_inr) beside that suspect's heat rating (heat).",
      hint: "SELECT c.loot_inr, s.heat FROM crimes c JOIN suspects s ON c.alias = s.alias.",
      solution: "SELECT c.loot_inr, s.heat FROM crimes c JOIN suspects s ON c.alias = s.alias",
      validationFn: (rows) => countIs(rows, 12) && hasColumns(rows, ["loot_inr", "heat"]),
      successMessage: "Twelve crimes, each pinned to a suspect — loot on one side, heat on the other. That's a join.",
    },
  },
  { id: "left-join", name: "LEFT JOIN", level: 5, keyword: "LEFT JOIN",
    status: "available", tagline: "Keeping unmatched rows from the left table.",
    blocks: [
      { kind: "text", body: "An INNER JOIN hides the rows that don't match — but sometimes the absence is the evidence. A LEFT JOIN keeps every row from the left (first) table, matched or not; where the right table has no match, its columns come back NULL." },
      { kind: "code", body: "SELECT s.alias, c.category\nFROM suspects s\nLEFT JOIN crimes c ON s.alias = c.alias;", caption: "Every suspect appears, even the informants with no crime on file — their category shows as NULL." },
      { kind: "text", body: "To isolate the unmatched rows — suspects with no crime — keep only those where the right side is NULL:" },
      { kind: "code", body: "SELECT s.alias\nFROM suspects s\nLEFT JOIN crimes c ON s.alias = c.alias\nWHERE c.crime_id IS NULL;", caption: "The 'anti-join': suspects who committed no logged crime. Test a column that's never null when matched, like the key." },
      { kind: "warning", body: "The order matters. couriers LEFT JOIN payments keeps all couriers; payments LEFT JOIN couriers keeps all payments. The left table is the one you refuse to lose rows from." },
    ],
    exercise: {
      prompt: "List every suspect and the category of any crime linked to their alias — including the suspects with no crimes on file. Keep all suspects.",
      hint: "SELECT s.alias, c.category FROM suspects s LEFT JOIN crimes c ON s.alias = c.alias.",
      solution: "SELECT s.alias, c.category FROM suspects s LEFT JOIN crimes c ON s.alias = c.alias",
      validationFn: (rows) => countIs(rows, 14),
      successMessage: "Fourteen rows: twelve crimes plus the two informants the crime ledger never mentions.",
    },
  },
  { id: "self-join", name: "SELF JOIN", level: 6, keyword: "SELF JOIN",
    status: "available", tagline: "Joining a table to itself.",
    blocks: [
      { kind: "text", body: "A JOIN doesn't need two different tables. Join a table to itself — a SELF JOIN — to compare rows within the same table: pairs of suspects in the same city, bids on the same lot, employees with the same manager." },
      { kind: "code", body: "SELECT a.alias, b.alias, a.home_city\nFROM suspects a\nJOIN suspects b ON a.home_city = b.home_city;", caption: "The trick is two aliases (a and b) for the one table, so SQLite treats them as separate copies to match against each other." },
      { kind: "text", body: "That query has a flaw: it pairs every suspect with themselves, and lists each pair twice (a–b and b–a). Fix both with a.alias < b.alias — it drops self-pairs and keeps each pair once:" },
      { kind: "code", body: "SELECT a.alias, b.alias\nFROM suspects a\nJOIN suspects b ON a.home_city = b.home_city\nAND a.alias < b.alias;", caption: "Only genuine, distinct pairs from the same city — no duplicates, no one paired with themselves." },
      { kind: "tip", body: "The < comparison is the standard self-join guard. Use it whenever you want unordered pairs (A with B, not also B with A)." },
    ],
    exercise: {
      prompt: "Find every pair of suspects who share the same home_city. Join suspects to itself on home_city, and use a.alias < b.alias so each pair appears once.",
      hint: "SELECT a.alias, b.alias FROM suspects a JOIN suspects b ON a.home_city = b.home_city AND a.alias < b.alias.",
      solution: "SELECT a.alias, b.alias FROM suspects a JOIN suspects b ON a.home_city = b.home_city AND a.alias < b.alias",
      validationFn: (rows) => countIs(rows, 7),
      successMessage: "Seven same-city pairs — six of them crowded into Devgarh alone.",
    },
  },
  { id: "union", name: "UNION", level: 6, keyword: "UNION",
    status: "available", tagline: "Stacking two result sets into one.",
    blocks: [
      { kind: "text", body: "JOIN glues tables side by side, adding columns. UNION stacks results top to bottom, adding rows — taking two SELECTs that return the same columns and merging them into one list." },
      { kind: "code", body: "SELECT alias FROM crimes WHERE category = 'Smuggling'\nUNION\nSELECT alias FROM crimes WHERE category = 'Fraud';", caption: "Every alias tied to smuggling or fraud, in one column. UNION removes duplicates — an alias in both appears once." },
      { kind: "text", body: "The two SELECTs must have the same number of columns, in the same order. Plain UNION deduplicates; UNION ALL keeps every row, including repeats:" },
      { kind: "code", body: "SELECT home_city FROM suspects\nUNION ALL\nSELECT city FROM crimes;", caption: "UNION ALL is faster and keeps duplicates — use it when you want counts, not a distinct set." },
      { kind: "warning", body: "The column names in the result come from the first SELECT. If the two sides mean different things, alias them to a common name so the merged column reads clearly." },
    ],
    exercise: {
      prompt: "Build one deduplicated list of every alias linked to a Smuggling crime or a Fraud crime. Stack the two filtered selects with UNION.",
      hint: "SELECT alias FROM crimes WHERE category = 'Smuggling' UNION SELECT alias FROM crimes WHERE category = 'Fraud'.",
      solution: "SELECT alias FROM crimes WHERE category = 'Smuggling' UNION SELECT alias FROM crimes WHERE category = 'Fraud'",
      validationFn: (rows) => countIs(rows, 5),
      successMessage: "Five names across the two rackets — and Silk turns up on both, counted only once.",
    },
  },
  { id: "subqueries", name: "Subqueries", level: 7, keyword: "SUBQUERY",
    status: "available", tagline: "Queries nested inside queries.",
    blocks: [
      { kind: "text", body: "A subquery is a SELECT wrapped in parentheses and used inside another query. The classic case: you need a value you can only get by querying first — like the average heat — then compare each row against it." },
      { kind: "code", body: "SELECT * FROM suspects\nWHERE heat > (SELECT AVG(heat) FROM suspects);", caption: "The inner query returns one number (the average heat). The outer query uses it as if you'd typed the number yourself — but SQLite computes it for you." },
      { kind: "text", body: "That inner query returns a single value, so it fits anywhere a value fits. A subquery can also return a column of values, tested with IN — 'is this row's alias one of the aliases that committed smuggling?'" },
      { kind: "code", body: "SELECT * FROM suspects\nWHERE alias IN (SELECT alias FROM crimes WHERE category = 'Smuggling');", caption: "The inner query lists every alias tied to smuggling; IN keeps the suspects whose alias is on that list. NOT IN keeps the ones who aren't." },
      { kind: "tip", body: "A subquery returning one value goes after a comparison like > or =. A subquery returning a column goes after IN or NOT IN. Match the shape of the subquery to how you use it." },
    ],
    exercise: {
      prompt: "Find the suspects whose heat is above the average heat across all suspects. Put the AVG in a subquery and compare each suspect's heat against it.",
      hint: "SELECT * FROM suspects WHERE heat > (SELECT AVG(heat) FROM suspects).",
      solution: "SELECT * FROM suspects WHERE heat > (SELECT AVG(heat) FROM suspects)",
      validationFn: (rows) => countIs(rows, 5),
      successMessage: "Five suspects run hotter than the average — the ones the department watches first.",
    },
  },
  { id: "exists", name: "EXISTS", level: 7, keyword: "EXISTS",
    status: "available", tagline: "Testing whether related rows exist.",
    blocks: [
      { kind: "text", body: "EXISTS asks a yes/no question: for this row, does the inner query find anything at all? It's a correlated subquery — the inner SELECT references the outer row, and runs once per row. You don't care what it returns, only whether it returns something." },
      { kind: "code", body: "SELECT * FROM suspects s\nWHERE EXISTS (\n  SELECT 1 FROM crimes c WHERE c.alias = s.alias\n);", caption: "For each suspect, look for a crime with the same alias. If one exists, keep the suspect. SELECT 1 is a convention — the value is irrelevant, only the existence matters." },
      { kind: "text", body: "NOT EXISTS flips it: keep the rows where the inner query finds nothing. It's the cleanest way to find the gaps — suspects with no recorded crime, arrivals with no clearance, records that should have a match but don't." },
      { kind: "code", body: "SELECT * FROM suspects s\nWHERE NOT EXISTS (\n  SELECT 1 FROM crimes c WHERE c.alias = s.alias\n);", caption: "The suspects no crime points to — clean on paper, or simply never caught." },
      { kind: "warning", body: "EXISTS and IN often answer the same question, but EXISTS handles NULLs safely where NOT IN can silently drop every row if the subquery contains a NULL. When the linking column might be NULL, reach for NOT EXISTS." },
    ],
    exercise: {
      prompt: "Find every suspect who has at least one recorded crime. Use EXISTS with a correlated subquery that matches crimes.alias to the suspect's alias.",
      hint: "SELECT * FROM suspects s WHERE EXISTS (SELECT 1 FROM crimes c WHERE c.alias = s.alias).",
      solution: "SELECT * FROM suspects s WHERE EXISTS (SELECT 1 FROM crimes c WHERE c.alias = s.alias)",
      validationFn: (rows) => countIs(rows, 8),
      successMessage: "Eight of the ten have a crime on record. The other two are ghosts — for now.",
    },
  },
  { id: "ctes", name: "CTEs", level: 8, keyword: "WITH",
    status: "available", tagline: "Named, layered subqueries with WITH.",
    blocks: [
      { kind: "text", body: "A subquery in the FROM clause works, but it gets unreadable fast. A common table expression (CTE) pulls it out front with WITH, gives it a name, and lets you query it like a real table — building your logic in clear, stacked layers." },
      { kind: "code", body: "WITH loot AS (\n  SELECT alias, SUM(loot_inr) AS total\n  FROM crimes GROUP BY alias\n)\nSELECT * FROM loot WHERE total > 1000000;", caption: "First the CTE 'loot' totals each alias's haul. Then the outer query treats loot as a table and filters it — a two-step thought written as two clear steps." },
      { kind: "text", body: "The real power is chaining: define several CTEs separated by commas, each able to reference the ones before it. Complex analysis becomes a readable pipeline instead of subqueries nested five deep." },
      { kind: "code", body: "WITH loot AS (\n  SELECT alias, SUM(loot_inr) AS total FROM crimes GROUP BY alias\n),\nbig AS (\n  SELECT * FROM loot WHERE total > 1000000\n)\nSELECT alias FROM big ORDER BY total DESC;", caption: "'big' builds on 'loot'. Each layer names one idea, and the final SELECT reads like a summary of the whole chain." },
      { kind: "tip", body: "A CTE that filters a window function is the standard trick: window functions can't go in WHERE, so compute the window in one CTE, then filter its result in the next." },
    ],
    exercise: {
      prompt: "Using a CTE named loot that sums loot_inr per alias, return the aliases whose total loot exceeds ₹10 lakh (1000000), largest first.",
      hint: "WITH loot AS (SELECT alias, SUM(loot_inr) AS total FROM crimes GROUP BY alias) SELECT * FROM loot WHERE total > 1000000 ORDER BY total DESC.",
      solution: "WITH loot AS (SELECT alias, SUM(loot_inr) AS total FROM crimes GROUP BY alias) SELECT * FROM loot WHERE total > 1000000 ORDER BY total DESC",
      validationFn: (rows) => countIs(rows, 4) && hasColumns(rows, ["alias", "total"]),
      successMessage: "Four aliases clear ten lakh — The Accountant's ₹53 lakh leads them all.",
    },
  },
  { id: "window-functions", name: "Window Functions", level: 8, keyword: "OVER()",
    status: "available", tagline: "Ranking and running totals across rows.",
    blocks: [
      { kind: "text", body: "GROUP BY collapses rows into one summary each. A window function keeps every row but adds a calculation computed across a 'window' of related rows — a rank, a running total, a share of the whole. You see the detail and the analysis side by side." },
      { kind: "code", body: "SELECT alias, loot_inr,\n  RANK() OVER (ORDER BY loot_inr DESC) AS rnk\nFROM crimes;", caption: "RANK() OVER (ORDER BY ...) numbers each row by loot, biggest first — but no rows are merged. Every crime is still listed, now with its rank attached." },
      { kind: "text", body: "PARTITION BY restarts the calculation for each group — like ranking within each category separately. And SUM() OVER (...) with an ORDER BY gives a running total that accumulates row by row." },
      { kind: "code", body: "SELECT category, alias, loot_inr,\n  RANK() OVER (PARTITION BY category ORDER BY loot_inr DESC) AS rnk\nFROM crimes;", caption: "The rank resets to 1 at the start of every category — the biggest haul in each racket, without a separate query per category." },
      { kind: "warning", body: "A window function's OVER (ORDER BY ...) sorts the calculation, not the final output. Add an outer ORDER BY to the query itself if you want the rows returned in that order." },
    ],
    exercise: {
      prompt: "Rank every crime by loot_inr, largest first, showing the alias, the loot, and a rank column named rnk. Use RANK() OVER (ORDER BY loot_inr DESC) and order the output by rnk.",
      hint: "SELECT alias, loot_inr, RANK() OVER (ORDER BY loot_inr DESC) AS rnk FROM crimes ORDER BY rnk.",
      solution: "SELECT alias, loot_inr, RANK() OVER (ORDER BY loot_inr DESC) AS rnk FROM crimes ORDER BY rnk",
      validationFn: (rows) => countIs(rows, 12) && hasColumns(rows, ["alias", "loot_inr", "rnk"]),
      successMessage: "Twelve crimes ranked in one pass — The Accountant's ₹45 lakh fraud takes the top spot.",
    },
  },
];

export const getTutorial = (id: string): TutorialConcept | undefined =>
  TUTORIALS.find((t) => t.id === id);

