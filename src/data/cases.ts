/**
 * THE BLACK LEDGER CONSPIRACY — case content for Devgarh.
 *
 * Each objective is validated by running the player's submitted query through
 * sql.js and passing the result rows to `validationFn`. Validation is lenient
 * about which columns are selected (it checks row counts + presence of the key
 * evidence values), but strict enough that a bare `SELECT *` fails a filtered
 * objective. Every objective here is solvable with concepts already taught, and
 * every solution is verified against the seed data (see scripts/verify-cases.ts).
 */

// ── Validation helpers ────────────────────────────────────────────────────────
type Row = Record<string, unknown>;

const norm = (v: unknown): string => String(v ?? "").trim().toLowerCase();
/** All of a row's values, lowercased and joined — lets checks ignore column choice. */
const rowText = (r: Row): string =>
  Object.values(r).map(norm).join(" | ");
/** At least one row mentions `sub` in any selected column. */
const anyRowHas = (rows: Row[], sub: string): boolean =>
  rows.some((r) => rowText(r).includes(sub.toLowerCase()));
/** Every row mentions `sub` (used to confirm a filter held across the result). */
const everyRowHas = (rows: Row[], sub: string): boolean =>
  rows.length > 0 && rows.every((r) => rowText(r).includes(sub.toLowerCase()));
/** Exact row count — the primary signal that the WHERE filter is correct. */
const countIs = (rows: Row[], n: number): boolean => rows.length === n;
/** The first returned row (post-ORDER BY) mentions `sub` in any column. */
const firstRowHas = (rows: Row[], sub: string): boolean =>
  rows.length > 0 && rowText(rows[0]).includes(sub.toLowerCase());
/**
 * The result is ordered by `col` in the given direction. Returns false if the
 * column wasn't selected (so ORDER BY objectives expect the column to be present).
 * Numbers compare numerically; text/date strings compare lexically (ISO dates sort chronologically).
 */
const isSorted = (rows: Row[], col: string, dir: "asc" | "desc"): boolean => {
  if (rows.length === 0) return false;
  const vals = rows.map((r) => r[col]);
  if (vals.some((v) => v === undefined)) return false;
  for (let i = 1; i < vals.length; i++) {
    const a = vals[i - 1];
    const b = vals[i];
    const cmp =
      typeof a === "number" && typeof b === "number"
        ? a - b
        : String(a).localeCompare(String(b));
    if (dir === "asc" && cmp > 0) return false;
    if (dir === "desc" && cmp < 0) return false;
  }
  return true;
};
/** Single-row, single-value aggregate result equals `expected` (exact numeric). */
const scalarIs = (rows: Row[], expected: number): boolean =>
  rows.length === 1 && Object.values(rows[0]).some((v) => Number(v) === expected);
/** Aggregate result within `tol` of `expected` (for AVG and other floats). */
const scalarApprox = (rows: Row[], expected: number, tol: number): boolean =>
  rows.length === 1 &&
  Object.values(rows[0]).some((v) => Math.abs(Number(v) - expected) <= tol);
/** All returned rows are distinct (used to confirm SELECT DISTINCT did its job). */
const allDistinct = (rows: Row[]): boolean => {
  const seen = new Set(rows.map((r) => rowText(r)));
  return rows.length > 0 && seen.size === rows.length;
};

export interface CaseObjective {
  id: string;
  title: string;
  description: string;
  hint: string;
  questId: string;
  /** Player must use submit() with a query whose result satisfies this fn */
  validationFn: (rows: Record<string, unknown>[]) => boolean;
  successMessage: string;
  narrativeAfter: string;
}

export interface CaseQuest {
  id: string;
  title: string;
  description: string;
  objectiveIds: string[];
}

export interface CaseSchema {
  tables: {
    name: string;
    columns: { name: string; type: string; key?: "PK" | "FK" }[];
    references?: { column: string; refTable: string; refColumn: string }[];
  }[];
}

export interface GameCase {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  difficulty: "Rookie" | "Detective" | "Senior Detective" | "Chief Inspector";
  /** The two SQL concepts this level teaches (cumulative). */
  concepts: string[];
  /** "available" = fully playable; "in-development" = locked placeholder. */
  status: "available" | "in-development";
  teaser: string;
  briefing: string;
  schema: CaseSchema;
  objectives: CaseObjective[];
  quests: CaseQuest[];
}

export const CASES: GameCase[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 1 — THE VANISHING WITNESS  (Devgarh · Purana Qila quarter)
  // Concepts: SELECT, WHERE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 1,
    slug: "the-vanishing-witness",
    title: "The Vanishing Witness",
    subtitle: "SELECT · WHERE",
    difficulty: "Rookie",
    concepts: ["SELECT", "WHERE"],
    status: "available",
    teaser:
      "A warehouse burns at the Old Fort docks. The one witness who saw the crates loaded has vanished. DI Kulkarni needs the Archivist to read the records.",
    briefing:
      "Devgarh, March 2024. A fire guts a timber godown at the Old Fort docks in the Purana Qila quarter. Amid the smoke, one man — Salim Ansari — swears he saw two figures load crates onto a launch and slip downriver. Three days later, Salim is gone. No note, no body, no trace. Detective Inspector Rhea Kulkarni has pulled the municipal and police records into the evidence terminal. Your job, Archivist: use SELECT and WHERE to comb the registers, find who was on that wharf, and pick up Salim's trail before it goes cold.",
    schema: {
      tables: [
        {
          name: "witnesses",
          columns: [
            { name: "witness_id", type: "INTEGER", key: "PK" },
            { name: "full_name", type: "TEXT" },
            { name: "neighborhood", type: "TEXT" },
            { name: "age", type: "INTEGER" },
            { name: "statement_summary", type: "TEXT" },
            { name: "contact_status", type: "TEXT" },
            { name: "last_seen_date", type: "TEXT" },
          ],
        },
        {
          name: "residents",
          columns: [
            { name: "resident_id", type: "INTEGER", key: "PK" },
            { name: "full_name", type: "TEXT" },
            { name: "neighborhood", type: "TEXT" },
            { name: "occupation", type: "TEXT" },
            { name: "phone", type: "TEXT" },
            { name: "flagged", type: "INTEGER" },
          ],
        },
        {
          name: "case_files",
          columns: [
            { name: "file_id", type: "INTEGER", key: "PK" },
            { name: "title", type: "TEXT" },
            { name: "district", type: "TEXT" },
            { name: "status", type: "TEXT" },
            { name: "opened_date", type: "TEXT" },
            { name: "lead_officer", type: "TEXT" },
          ],
        },
        {
          name: "sightings",
          columns: [
            { name: "sighting_id", type: "INTEGER", key: "PK" },
            { name: "person_name", type: "TEXT" },
            { name: "location", type: "TEXT" },
            { name: "sighting_date", type: "TEXT" },
            { name: "sighting_time", type: "TEXT" },
            { name: "reported_by", type: "TEXT" },
          ],
        },
      ],
    },
    quests: [
      { id: "1-q1", title: "First Look", description: "Open the registers and learn to read them.", objectiveIds: ["1-1", "1-2", "1-3"] },
      { id: "1-q2", title: "Narrowing the Field", description: "Filter the records down to people who matter.", objectiveIds: ["1-4", "1-5", "1-6", "1-7"] },
      { id: "1-q3", title: "The Trail Goes Cold", description: "Follow Salim's last movements and name a person of interest.", objectiveIds: ["1-8", "1-9", "1-10"] },
    ],
    objectives: [
      // OBJ_1_1
      {
        id: "1-1",
        title: "Read the witness registry",
        description:
          "Pull the full records from the witnesses table so we can see everyone who came forward. Return all columns for every witness.",
        hint: "SELECT * FROM witnesses — the * means 'every column'.",
        questId: "1-q1",
        validationFn: (rows) => countIs(rows, 12) && anyRowHas(rows, "salim ansari"),
        successMessage: "Twelve statements on file. Salim Ansari is right there at the top.",
        narrativeAfter:
          "KULKARNI: Twelve people talked to us that week. Only one of them has since vanished. Let's find his file.",
      },
      // OBJ_1_2
      {
        id: "1-2",
        title: "Find the missing witness",
        description:
          "Retrieve the full record for the witness named 'Salim Ansari' using a WHERE filter on full_name.",
        hint: "SELECT * FROM witnesses WHERE full_name = 'Salim Ansari' — text values go in single quotes.",
        questId: "1-q1",
        validationFn: (rows) =>
          countIs(rows, 1) && everyRowHas(rows, "salim ansari") && everyRowHas(rows, "missing"),
        successMessage: "Salim Ansari — status: MISSING. Last seen 12 March, the night of the fire.",
        narrativeAfter:
          "KULKARNI: 'Missing' since the twelfth. He saw the crates go onto that launch, and then he saw nothing ever again. Who else was in his neighborhood?",
      },
      // OBJ_1_3
      {
        id: "1-3",
        title: "Canvass the neighborhood",
        description:
          "List the full records of every resident living in the 'Purana Qila' neighborhood.",
        hint: "SELECT * FROM residents WHERE neighborhood = 'Purana Qila'.",
        questId: "1-q1",
        validationFn: (rows) => countIs(rows, 10) && everyRowHas(rows, "purana qila"),
        successMessage: "Ten residents on the register for Purana Qila. Somewhere in here is our man.",
        narrativeAfter:
          "KULKARNI: The Old Fort quarter keeps to itself. If Salim was taken, someone on this list knows why.",
      },
      // OBJ_1_4
      {
        id: "1-4",
        title: "Pull the persons of interest",
        description:
          "The records mark certain people as flagged (flagged = 1). Return the full records of every flagged resident.",
        hint: "SELECT * FROM residents WHERE flagged = 1 — numbers are written without quotes.",
        questId: "1-q2",
        validationFn: (rows) =>
          countIs(rows, 5) && anyRowHas(rows, "farhan qureshi") && anyRowHas(rows, "anil bhatt"),
        successMessage: "Five names already flagged by the precinct. Two of them work the docks.",
        narrativeAfter:
          "KULKARNI: Flagged doesn't mean guilty. But it means someone, sometime, thought they were worth watching.",
      },
      // OBJ_1_5
      {
        id: "1-5",
        title: "Who works the docks?",
        description:
          "Salim worked the wharf. Return the full records of every resident whose occupation is 'Dockworker'.",
        hint: "SELECT * FROM residents WHERE occupation = 'Dockworker'.",
        questId: "1-q2",
        validationFn: (rows) => countIs(rows, 6) && everyRowHas(rows, "dockworker"),
        successMessage: "Six dockworkers across Devgarh. The crates don't load themselves.",
        narrativeAfter:
          "KULKARNI: Every one of these men knows how a launch is loaded in the dark. Narrow it to the Old Fort.",
      },
      // OBJ_1_6
      {
        id: "1-6",
        title: "Open files at the Old Fort",
        description:
          "Return the full records of every case_file in the 'Purana Qila' district whose status is 'Open'.",
        hint: "Combine two conditions with AND: WHERE district = 'Purana Qila' AND status = 'Open'.",
        questId: "1-q2",
        validationFn: (rows) =>
          countIs(rows, 2) && everyRowHas(rows, "purana qila") && everyRowHas(rows, "open"),
        successMessage: "Two open files — the fire, and Salim's disappearance. Same quarter, same week.",
        narrativeAfter:
          "KULKARNI: The fire and the missing witness are the same case now. I can feel it.",
      },
      // OBJ_1_7
      {
        id: "1-7",
        title: "Everything at the wharf",
        description:
          "The launch left from the Ferry Wharf. Return the full records of every sighting where the location is 'Ferry Wharf'.",
        hint: "SELECT * FROM sightings WHERE location = 'Ferry Wharf'.",
        questId: "1-q2",
        validationFn: (rows) => countIs(rows, 6) && everyRowHas(rows, "ferry wharf"),
        successMessage: "Six sightings logged at the Ferry Wharf. Now filter for the night that matters.",
        narrativeAfter:
          "KULKARNI: The wharf was busier than the docket admits. Focus on the night of the twelfth.",
      },
      // OBJ_1_8
      {
        id: "1-8",
        title: "Salim's last movements",
        description:
          "Trace the witness. Return the full records of every sighting where the person_name is 'Salim Ansari'.",
        hint: "SELECT * FROM sightings WHERE person_name = 'Salim Ansari'.",
        questId: "1-q3",
        validationFn: (rows) => countIs(rows, 3) && everyRowHas(rows, "salim ansari"),
        successMessage: "Three sightings of Salim — the last at the Timber Godown, 23:10 on the twelfth.",
        narrativeAfter:
          "KULKARNI: He was at the godown after eleven. Whoever was at the wharf that same hour is our man.",
      },
      // OBJ_1_9
      {
        id: "1-9",
        title: "Flagged, dockworker, and local",
        description:
          "Return the full records of residents who live in 'Purana Qila', work as a 'Dockworker', AND are flagged (flagged = 1). Chain all three conditions with AND.",
        hint: "WHERE neighborhood = 'Purana Qila' AND occupation = 'Dockworker' AND flagged = 1.",
        questId: "1-q3",
        validationFn: (rows) =>
          countIs(rows, 2) && anyRowHas(rows, "farhan qureshi") && anyRowHas(rows, "bhaskar pawar"),
        successMessage: "Two names survive every filter: Farhan Qureshi and Bhaskar Pawar.",
        narrativeAfter:
          "KULKARNI: Two suspects. One was at the wharf the night Salim vanished. Prove which.",
      },
      // OBJ_1_10
      {
        id: "1-10",
        title: "Name the person of interest",
        description:
          "Who was at the Ferry Wharf on 2024-03-12 after 22:00? Return the sighting(s) where location is 'Ferry Wharf' AND sighting_date is '2024-03-12' AND sighting_time is later than '22:00'.",
        hint: "Times are stored as text, so comparison works: WHERE location = 'Ferry Wharf' AND sighting_date = '2024-03-12' AND sighting_time > '22:00'.",
        questId: "1-q3",
        validationFn: (rows) =>
          countIs(rows, 1) && everyRowHas(rows, "farhan qureshi") && everyRowHas(rows, "ferry wharf"),
        successMessage: "Farhan Qureshi. At the wharf, 22:40, the night Salim disappeared. That's our thread.",
        narrativeAfter:
          "KULKARNI: Farhan Qureshi. Flagged dockworker, at the wharf minutes before Salim was last seen. He didn't act alone — someone paid for that launch. But he's how we pull the string. Good work, Archivist. This is only the first knot in a much longer rope.",
      },
    ],
  },
  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 2 — THE HOTEL ON ASH STREET  (Devgarh · Grand Meridian, near the Junction)
  // Concepts: ORDER BY, LIMIT
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 2,
    slug: "the-hotel-on-ash-street",
    title: "The Hotel on Ash Street",
    subtitle: "ORDER BY · LIMIT",
    difficulty: "Detective",
    concepts: ["ORDER BY", "LIMIT"],
    status: "available",
    teaser:
      "Farhan named a hotel. The Grand Meridian on Ash Street, by the railway junction, where the launch crew washed up — and where a great deal of cash changed hands.",
    briefing:
      "The Grand Meridian is the oldest hotel on Ash Street, a stone's throw from Devgarh Junction railway station — all brass fittings and long memories. Farhan Qureshi says the men from the launch checked in here the night of the fire. DI Kulkarni has seized the guest book, the room-service dockets, and the branch's cash-deposit slips. Somewhere in the rankings is the man who paid too much, too quietly. Use ORDER BY to sort the ledgers and LIMIT to skim off the top — find the biggest cash guest, and follow his money to the bank.",
    schema: {
      tables: [
        {
          name: "hotel_guests",
          columns: [
            { name: "guest_id", type: "INTEGER", key: "PK" },
            { name: "full_name", type: "TEXT" },
            { name: "room_number", type: "INTEGER" },
            { name: "check_in", type: "TEXT" },
            { name: "check_out", type: "TEXT" },
            { name: "amount_paid", type: "INTEGER" },
            { name: "payment_method", type: "TEXT" },
            { name: "city_of_origin", type: "TEXT" },
          ],
        },
        {
          name: "room_service_orders",
          columns: [
            { name: "order_id", type: "INTEGER", key: "PK" },
            { name: "room_number", type: "INTEGER" },
            { name: "item", type: "TEXT" },
            { name: "quantity", type: "INTEGER" },
            { name: "price", type: "INTEGER" },
            { name: "order_time", type: "TEXT" },
          ],
        },
        {
          name: "cash_deposits",
          columns: [
            { name: "deposit_id", type: "INTEGER", key: "PK" },
            { name: "depositor_name", type: "TEXT" },
            { name: "amount", type: "INTEGER" },
            { name: "deposit_date", type: "TEXT" },
            { name: "bank_branch", type: "TEXT" },
          ],
        },
      ],
    },
    quests: [
      { id: "2-q1", title: "The Guest Book", description: "Sort the register and find who paid the most.", objectiveIds: ["2-1", "2-2", "2-3"] },
      { id: "2-q2", title: "Latest and Cheapest", description: "Order by time and by price to see who stayed and who skimped.", objectiveIds: ["2-4", "2-5", "2-6"] },
      { id: "2-q3", title: "Following the Cash", description: "Rank the cash and trace it to the bank.", objectiveIds: ["2-7", "2-8", "2-9", "2-10"] },
    ],
    objectives: [
      // OBJ_2_1
      {
        id: "2-1",
        title: "Sort the guest book by spend",
        description:
          "Return all guests, ordered by amount_paid from highest to lowest.",
        hint: "SELECT * FROM hotel_guests ORDER BY amount_paid DESC — DESC means descending (biggest first).",
        questId: "2-q1",
        validationFn: (rows) =>
          countIs(rows, 20) && isSorted(rows, "amount_paid", "desc") && firstRowHas(rows, "meridian holdings rep"),
        successMessage: "Sorted. A corporate booking sits on top — Meridian Holdings, ₹4,20,000.",
        narrativeAfter:
          "KULKARNI: 'Meridian Holdings.' A name that keeps turning up on paper and never in person. Skim the top of the list.",
      },
      // OBJ_2_2
      {
        id: "2-2",
        title: "The top five spenders",
        description:
          "Return only the five highest-paying guests, ordered by amount_paid descending.",
        hint: "Add LIMIT 5 after your ORDER BY: ORDER BY amount_paid DESC LIMIT 5.",
        questId: "2-q1",
        validationFn: (rows) =>
          countIs(rows, 5) && isSorted(rows, "amount_paid", "desc") && firstRowHas(rows, "meridian holdings rep"),
        successMessage: "Five names carry most of the money through this hotel.",
        narrativeAfter:
          "KULKARNI: Five guests, lakhs each. Ordinary travellers don't spend like this at the Meridian.",
      },
      // OBJ_2_3
      {
        id: "2-3",
        title: "The single biggest bill",
        description:
          "Return just the one guest who paid the most of all.",
        hint: "ORDER BY amount_paid DESC LIMIT 1 leaves only the top row.",
        questId: "2-q1",
        validationFn: (rows) => countIs(rows, 1) && firstRowHas(rows, "meridian holdings rep"),
        successMessage: "Meridian Holdings — but a 'rep', no real name. A shell paying a shell.",
        narrativeAfter:
          "KULKARNI: A representative of a holding company, paying by card, leaving no fingerprints. Set it aside. I want the cash.",
      },
      // OBJ_2_4
      {
        id: "2-4",
        title: "Who lingered longest",
        description:
          "Return all guests ordered by check_out date, latest checkout first.",
        hint: "ORDER BY check_out DESC — ISO dates sort correctly as text.",
        questId: "2-q2",
        validationFn: (rows) =>
          countIs(rows, 20) && isSorted(rows, "check_out", "desc") && firstRowHas(rows, "2024-03-17"),
        successMessage: "Manish Doshi checked out last, on the 17th — five nights, all in cash.",
        narrativeAfter:
          "KULKARNI: The ones who linger are usually waiting for something. Or someone.",
      },
      // OBJ_2_5
      {
        id: "2-5",
        title: "The last to arrive",
        description:
          "Return the three most recent check-ins, ordered by check_in descending.",
        hint: "ORDER BY check_in DESC LIMIT 3.",
        questId: "2-q2",
        validationFn: (rows) =>
          countIs(rows, 3) && isSorted(rows, "check_in", "desc") && everyRowHas(rows, "2024-03-12"),
        successMessage: "Three guests checked in on the 12th — the very night of the fire.",
        narrativeAfter:
          "KULKARNI: Farhan among them. They all arrived the night the godown burned. No coincidence books itself a room.",
      },
      // OBJ_2_6
      {
        id: "2-6",
        title: "The cheapest orders",
        description:
          "Return the five cheapest room-service orders, ordered by price ascending.",
        hint: "ORDER BY price ASC LIMIT 5 — ASC means ascending (smallest first).",
        questId: "2-q2",
        validationFn: (rows) =>
          countIs(rows, 5) && isSorted(rows, "price", "asc") && firstRowHas(rows, "cutting chai"),
        successMessage: "A ₹40 cutting chai to room 118 at dawn — Farhan's nerves, no doubt.",
        narrativeAfter:
          "KULKARNI: The big spenders drank single malt at midnight. Our dockhand had chai at six. Different men, same launch.",
      },
      // OBJ_2_7
      {
        id: "2-7",
        title: "Rank the cash guests",
        description:
          "Return only guests who paid by 'Cash', ordered by amount_paid from highest to lowest.",
        hint: "Combine WHERE and ORDER BY: WHERE payment_method = 'Cash' ORDER BY amount_paid DESC.",
        questId: "2-q3",
        validationFn: (rows) =>
          countIs(rows, 8) && everyRowHas(rows, "cash") && isSorted(rows, "amount_paid", "desc") && firstRowHas(rows, "imtiaz sayed"),
        successMessage: "Eight cash guests. At the top: Imtiaz Sayed, ₹2,85,000, in from Konkan Port.",
        narrativeAfter:
          "KULKARNI: Konkan Port. That's a cargo terminal three hundred kilometres down the coast. What's a port man doing paying cash in a Devgarh hotel?",
      },
      // OBJ_2_8
      {
        id: "2-8",
        title: "The largest cash deposit",
        description:
          "Switch to the bank slips. Return the single largest deposit in the cash_deposits table.",
        hint: "ORDER BY amount DESC LIMIT 1.",
        questId: "2-q3",
        validationFn: (rows) => countIs(rows, 1) && firstRowHas(rows, "imtiaz sayed"),
        successMessage: "₹9,00,000 deposited by Imtiaz Sayed the day after checkout. The same man.",
        narrativeAfter:
          "KULKARNI: He pays lakhs in cash at the hotel, then walks nine lakh more into the branch by the station. He's not a guest. He's a courier.",
      },
      // OBJ_2_9
      {
        id: "2-9",
        title: "Top three deposits",
        description:
          "Return the three largest deposits, ordered by amount descending.",
        hint: "ORDER BY amount DESC LIMIT 3.",
        questId: "2-q3",
        validationFn: (rows) =>
          countIs(rows, 3) && isSorted(rows, "amount", "desc") && firstRowHas(rows, "imtiaz sayed"),
        successMessage: "Sayed, then 'Meridian Holdings', then Ravi Teja — the same three names, again.",
        narrativeAfter:
          "KULKARNI: The hotel top-spenders and the bank top-depositors are the same people. The money moves in a circle, and Meridian Holdings sits in the middle of it.",
      },
      // OBJ_2_10
      {
        id: "2-10",
        title: "Name the courier",
        description:
          "Return the top cash-paying guest who came from 'Konkan Port'. Filter on payment_method and city_of_origin, then order and limit to one.",
        hint: "WHERE payment_method = 'Cash' AND city_of_origin = 'Konkan Port' ORDER BY amount_paid DESC LIMIT 1.",
        questId: "2-q3",
        validationFn: (rows) =>
          countIs(rows, 1) && firstRowHas(rows, "imtiaz sayed") && firstRowHas(rows, "konkan port"),
        successMessage: "Imtiaz Sayed, Konkan Port. Our courier — and our road to the coast.",
        narrativeAfter:
          "KULKARNI: Imtiaz Sayed carries the cash between the port and Devgarh. Whatever came off that launch came from Konkan Port. But before we chase the coast, we have dozens of scattered witness statements to make sense of. Next, Archivist, we count. Good work.",
      },
    ],
  },
  // ══════════════════════════════════════════════════════════════════════════
  // LEVEL 3 — THE SILENT WITNESSES  (Devgarh · scattered district interviews)
  // Concepts: DISTINCT, Aggregates (COUNT/SUM/AVG/MIN/MAX)
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 3,
    slug: "the-silent-witnesses",
    title: "The Silent Witnesses",
    subtitle: "DISTINCT · COUNT · SUM · AVG · MIN · MAX",
    difficulty: "Detective",
    concepts: ["DISTINCT", "Aggregate Functions"],
    status: "available",
    teaser:
      "Two dozen statements, six districts, four officers, and one recovered pile of evidence. Before Kulkarni can move on the coast, she needs the numbers.",
    briefing:
      "The Salim Ansari case has spilled across half of Devgarh. Officers have logged interviews in six districts, and the property room is filling with seized evidence — crates, cash bundles, a launch, a plateless sedan. Before DI Kulkarni takes this to the Commissioner, she needs it summarised: how many statements, how reliable, how much evidence, and how much of it is still missing. Use DISTINCT to strip the duplicates and the aggregate functions — COUNT, SUM, AVG, MIN, MAX — to turn a mound of paper into a single, undeniable set of figures.",
    schema: {
      tables: [
        {
          name: "interview_records",
          columns: [
            { name: "interview_id", type: "INTEGER", key: "PK" },
            { name: "witness_name", type: "TEXT" },
            { name: "district", type: "TEXT" },
            { name: "officer", type: "TEXT" },
            { name: "statement_date", type: "TEXT" },
            { name: "reliability_score", type: "INTEGER" },
            { name: "minutes_long", type: "INTEGER" },
          ],
        },
        {
          name: "evidence_items",
          columns: [
            { name: "item_id", type: "INTEGER", key: "PK" },
            { name: "description", type: "TEXT" },
            { name: "district", type: "TEXT" },
            { name: "category", type: "TEXT" },
            { name: "value_inr", type: "INTEGER" },
            { name: "recovered", type: "INTEGER" },
          ],
        },
      ],
    },
    quests: [
      { id: "3-q1", title: "Taking Roll", description: "Strip duplicates and count the statements.", objectiveIds: ["3-1", "3-2", "3-3"] },
      { id: "3-q2", title: "Weighing the Words", description: "Measure how many, how reliable, how long.", objectiveIds: ["3-4", "3-5", "3-6", "3-7"] },
      { id: "3-q3", title: "The Weight of Evidence", description: "Total the haul and count what's credible.", objectiveIds: ["3-8", "3-9", "3-10"] },
    ],
    objectives: [
      // OBJECTIVES_3
      {
        id: "3-1",
        title: "Which districts spoke",
        description:
          "List every district that appears in interview_records, with no duplicates. Select the DISTINCT district column.",
        hint: "SELECT DISTINCT district FROM interview_records.",
        questId: "3-q1",
        validationFn: (rows) => countIs(rows, 6) && allDistinct(rows) && anyRowHas(rows, "konkan gate"),
        successMessage: "Six districts. This case has crossed half of Devgarh.",
        narrativeAfter:
          "KULKARNI: Konkan Gate, all the way from the coast road. The web is wider than the docket admits.",
      },
      {
        id: "3-2",
        title: "Which officers logged them",
        description:
          "List the distinct officers who recorded these statements. Select the DISTINCT officer column.",
        hint: "SELECT DISTINCT officer FROM interview_records.",
        questId: "3-q1",
        validationFn: (rows) => countIs(rows, 4) && allDistinct(rows) && anyRowHas(rows, "kulkarni"),
        successMessage: "Four officers, my own name among them. Everyone touched this case.",
        narrativeAfter: "IQBAL: Four of us running the same ghost. No wonder the stories don't line up.",
      },
      {
        id: "3-3",
        title: "Count the statements",
        description:
          "How many interview records are there in total? Use COUNT(*).",
        hint: "SELECT COUNT(*) FROM interview_records.",
        questId: "3-q1",
        validationFn: (rows) => scalarIs(rows, 24),
        successMessage: "Twenty-four statements on file.",
        narrativeAfter: "KULKARNI: Twenty-four. Now let's see how many of them are worth the ink.",
      },
      {
        id: "3-4",
        title: "The Purana Qila count",
        description:
          "How many statements were taken in 'Purana Qila'? Use COUNT(*) with a WHERE filter.",
        hint: "SELECT COUNT(*) FROM interview_records WHERE district = 'Purana Qila'.",
        questId: "3-q2",
        validationFn: (rows) => scalarIs(rows, 6),
        successMessage: "Six statements out of the Old Fort quarter — the heart of it.",
        narrativeAfter: "KULKARNI: The Old Fort keeps producing witnesses. And keeps losing them.",
      },
      {
        id: "3-5",
        title: "Average reliability",
        description:
          "What is the average reliability_score across all interviews? Use AVG(reliability_score).",
        hint: "SELECT AVG(reliability_score) FROM interview_records.",
        questId: "3-q2",
        validationFn: (rows) => scalarApprox(rows, 5.8333, 0.01),
        successMessage: "An average near six. Half our witnesses are shaky at best.",
        narrativeAfter: "IQBAL: Frightened people don't remember straight, ma'am.",
      },
      {
        id: "3-6",
        title: "The longest interview",
        description:
          "What is the greatest minutes_long value on record? Use MAX(minutes_long).",
        hint: "SELECT MAX(minutes_long) FROM interview_records.",
        questId: "3-q2",
        validationFn: (rows) => scalarIs(rows, 72),
        successMessage: "Seventy-two minutes — Rekha Nair, the journalist. She had a great deal to say.",
        narrativeAfter: "KULKARNI: The one who talked longest may be the one worth listening to.",
      },
      {
        id: "3-7",
        title: "The least reliable word",
        description:
          "What is the lowest reliability_score in the file? Use MIN(reliability_score).",
        hint: "SELECT MIN(reliability_score) FROM interview_records.",
        questId: "3-q2",
        validationFn: (rows) => scalarIs(rows, 1),
        successMessage: "A one. Someone was lying to our faces.",
        narrativeAfter: "KULKARNI: The lowest scores cluster at Konkan Gate. Coincidence rarely is.",
      },
      {
        id: "3-8",
        title: "Value of the haul",
        description:
          "What is the total value_inr of all evidence seized? Use SUM(value_inr) over evidence_items.",
        hint: "SELECT SUM(value_inr) FROM evidence_items.",
        questId: "3-q3",
        validationFn: (rows) => scalarIs(rows, 3553000),
        successMessage: "Over thirty-five lakh in seized property. This is no petty smuggling.",
        narrativeAfter: "KULKARNI: Thirty-five lakh, and most of it still logged as not recovered.",
      },
      {
        id: "3-9",
        title: "Kinds of evidence",
        description:
          "How many distinct evidence categories are in the property room? Use COUNT(DISTINCT category).",
        hint: "SELECT COUNT(DISTINCT category) FROM evidence_items.",
        questId: "3-q3",
        validationFn: (rows) => scalarIs(rows, 5),
        successMessage: "Five kinds: documents, contraband, cash, weapons, vehicles. A full operation.",
        narrativeAfter: "IQBAL: Weapons too. This stopped being about a missing dockhand a while ago.",
      },
      {
        id: "3-10",
        title: "The credible witnesses",
        description:
          "How many interviews scored a reliability_score of 8 or higher? Use COUNT(*) with a WHERE filter.",
        hint: "SELECT COUNT(*) FROM interview_records WHERE reliability_score >= 8.",
        questId: "3-q3",
        validationFn: (rows) => scalarIs(rows, 8),
        successMessage: "Eight witnesses we can stand behind. Enough to build a case.",
        narrativeAfter:
          "KULKARNI: Eight solid statements, thirty-five lakh in evidence, six districts. Time to stop counting and start grouping — I want to know which precinct is rotten. Excellent work, Archivist.",
      },
    ],
  },
  // ══════════════════════════════════════════════════════════════════════════
  // LEVELS 4–8 — IN DEVELOPMENT (locked placeholders; unlock is sequential, so
  // these are unreachable until Level 3 is complete and their content ships).
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 4,
    slug: "the-corrupt-precinct",
    title: "The Corrupt Precinct",
    subtitle: "GROUP BY · HAVING",
    difficulty: "Senior Detective",
    concepts: ["GROUP BY", "HAVING"],
    status: "available",
    teaser:
      "The seizure logs don't add up. Somewhere inside Precinct 47, evidence walks out the back door. Group the numbers and the guilty desk reveals itself.",
    briefing:
      "DI Kulkarni's totals hide a pattern the property room would rather she never saw. Precinct 47 books evidence in and, somehow, less of it comes back out. Grouping the seizure logs by officer, by desk, and by district turns a wall of entries into a handful of damning figures — and one desk's books simply refuse to balance. Use GROUP BY to bucket the records and HAVING to keep only the groups that betray the leak, then follow the transfer log to whoever signed the missing evidence away.",
    schema: {
      tables: [
        {
          name: "seizures",
          columns: [
            { name: "seizure_id", type: "INTEGER", key: "PK" },
            { name: "officer", type: "TEXT" },
            { name: "desk", type: "TEXT" },
            { name: "district", type: "TEXT" },
            { name: "category", type: "TEXT" },
            { name: "value_inr", type: "INTEGER" },
            { name: "recovered", type: "INTEGER" },
            { name: "seized_date", type: "TEXT" },
          ],
        },
        {
          name: "transfer_log",
          columns: [
            { name: "transfer_id", type: "INTEGER", key: "PK" },
            { name: "item_ref", type: "TEXT" },
            { name: "from_desk", type: "TEXT" },
            { name: "to_office", type: "TEXT" },
            { name: "authorised_by", type: "TEXT" },
            { name: "transfer_date", type: "TEXT" },
          ],
        },
      ],
    },
    quests: [
      { id: "4-q1", title: "Reading the Registers", description: "Bucket the seizure logs and count what each group holds.", objectiveIds: ["4-1", "4-2", "4-3"] },
      { id: "4-q2", title: "The Unbalanced Books", description: "Total and average the groups until the odd desk stands out.", objectiveIds: ["4-4", "4-5", "4-6"] },
      { id: "4-q3", title: "The Guilty Desk", description: "Filter the groups with HAVING, then follow the missing evidence.", objectiveIds: ["4-7", "4-8", "4-9", "4-10"] },
    ],
    objectives: [
      // OBJECTIVES_4
      {
        id: "4-1",
        title: "Seizures per officer",
        description:
          "Bucket the seizure logs by officer and count how many each one booked. Return one row per officer with the count. Use GROUP BY officer.",
        hint: "SELECT officer, COUNT(*) FROM seizures GROUP BY officer.",
        questId: "4-q1",
        validationFn: (rows) => countIs(rows, 5) && anyRowHas(rows, "salunke"),
        successMessage: "Five officers filled this room. ASI Salunke booked more than anyone.",
        narrativeAfter:
          "KULKARNI: Five desks, one property room. Now let's see where the value piled up.",
      },
      {
        id: "4-2",
        title: "Value seized per district",
        description:
          "Total the value_inr of seizures in each district. Return one row per district. Use GROUP BY district with SUM(value_inr).",
        hint: "SELECT district, SUM(value_inr) FROM seizures GROUP BY district.",
        questId: "4-q1",
        validationFn: (rows) => countIs(rows, 6) && anyRowHas(rows, "konkan gate"),
        successMessage: "Six districts, and Konkan Gate carries the heaviest haul by far.",
        narrativeAfter:
          "KULKARNI: The coast road again. Every rupee of trouble traces back toward Konkan Port.",
      },
      {
        id: "4-3",
        title: "Which desk booked what",
        description:
          "Count how many seizures passed through each property desk. Return one row per desk. Use GROUP BY desk.",
        hint: "SELECT desk, COUNT(*) FROM seizures GROUP BY desk.",
        questId: "4-q1",
        validationFn: (rows) => countIs(rows, 3) && anyRowHas(rows, "central store"),
        successMessage: "Three desks. The Central Store handled the most — and, it turns out, kept the least.",
        narrativeAfter:
          "KULKARNI: Three desks. One of them is bleeding evidence. Add up what each is holding.",
      },
      // OBJECTIVES_4_MID
      {
        id: "4-4",
        title: "Rank the desks by value",
        description:
          "For each officer, total the value they seized, and order the groups from highest total to lowest. Alias the total AS total so it can be sorted. Use GROUP BY officer with ORDER BY.",
        hint: "SELECT officer, SUM(value_inr) AS total FROM seizures GROUP BY officer ORDER BY total DESC.",
        questId: "4-q2",
        validationFn: (rows) =>
          countIs(rows, 5) && isSorted(rows, "total", "desc") && firstRowHas(rows, "salunke"),
        successMessage: "ASI Dev Salunke on top — over ₹21 lakh booked to his name.",
        narrativeAfter:
          "KULKARNI: Salunke handled more value than the rest of the precinct combined. That much money leaves a mark.",
      },
      {
        id: "4-5",
        title: "Where the evidence vanished",
        description:
          "Look only at seizures never recovered (recovered = 0), then count how many each desk lost. Filter first, then group. Use WHERE recovered = 0 with GROUP BY desk.",
        hint: "SELECT desk, COUNT(*) FROM seizures WHERE recovered = 0 GROUP BY desk.",
        questId: "4-q2",
        validationFn: (rows) => countIs(rows, 2) && anyRowHas(rows, "central store"),
        successMessage: "Two desks report losses — but the Central Store lost seven items to the Annexe's one.",
        narrativeAfter:
          "KULKARNI: One desk misplaces a single knife. The Central Store misplaces seven crates. That's not carelessness.",
      },
      {
        id: "4-6",
        title: "Average haul by category",
        description:
          "For each category of evidence, compute the average value_inr. Return one row per category. Use GROUP BY category with AVG(value_inr).",
        hint: "SELECT category, AVG(value_inr) FROM seizures GROUP BY category.",
        questId: "4-q2",
        validationFn: (rows) => countIs(rows, 5) && anyRowHas(rows, "vehicle"),
        successMessage: "Five categories. Vehicles and cash average the highest — and those are exactly what went missing.",
        narrativeAfter:
          "KULKARNI: The dearest categories are the ones that never came back. Now filter the groups — I want only the desks that fail the test.",
      },
      // OBJECTIVES_4_END
      {
        id: "4-7",
        title: "The busiest hands",
        description:
          "Which officers booked more than four seizures? Group by officer, then keep only the groups whose count exceeds four. Use GROUP BY officer with HAVING COUNT(*) > 4.",
        hint: "SELECT officer, COUNT(*) FROM seizures GROUP BY officer HAVING COUNT(*) > 4.",
        questId: "4-q3",
        validationFn: (rows) => countIs(rows, 1) && anyRowHas(rows, "salunke"),
        successMessage: "Only one desk clears the bar: ASI Dev Salunke, six seizures.",
        narrativeAfter:
          "KULKARNI: HAVING is WHERE for groups. One name survives it. Now weigh what he lost.",
      },
      {
        id: "4-8",
        title: "The desk that won't balance",
        description:
          "Among unrecovered seizures (recovered = 0), which desk is holding losses worth more than ₹10,00,000? Filter, group by desk, then keep groups whose total exceeds 1000000. Alias the total AS lost.",
        hint: "SELECT desk, SUM(value_inr) AS lost FROM seizures WHERE recovered = 0 GROUP BY desk HAVING SUM(value_inr) > 1000000.",
        questId: "4-q3",
        validationFn: (rows) => countIs(rows, 1) && anyRowHas(rows, "central store"),
        successMessage: "The Central Store — ₹23,62,000 booked in and never seen again.",
        narrativeAfter:
          "KULKARNI: Twenty-three lakh, gone from one desk. Who works that desk, and where did it all go?",
      },
      {
        id: "4-9",
        title: "Officers over the line",
        description:
          "Which officers seized more than ₹2,00,000 in total value? Group by officer and keep only the groups whose summed value exceeds 200000. Use HAVING SUM(value_inr) > 200000.",
        hint: "SELECT officer, SUM(value_inr) AS total FROM seizures GROUP BY officer HAVING SUM(value_inr) > 200000.",
        questId: "4-q3",
        validationFn: (rows) => countIs(rows, 3) && anyRowHas(rows, "salunke"),
        successMessage: "Three officers cross the line — Salunke, Deshpande, Gokhale. Two of them work the Central Store.",
        narrativeAfter:
          "KULKARNI: Salunke and Gokhale, both on the Central Store. The missing evidence didn't evaporate — it was moved. Find the transfer that moved it.",
      },
      {
        id: "4-10",
        title: "Who signed it away",
        description:
          "The transfer_log records who authorised each evidence transfer. Group the transfers by authorised_by and find who signed off on more than five. Use GROUP BY authorised_by with HAVING COUNT(*) > 5.",
        hint: "SELECT authorised_by, COUNT(*) FROM transfer_log GROUP BY authorised_by HAVING COUNT(*) > 5.",
        questId: "4-q3",
        validationFn: (rows) => countIs(rows, 1) && anyRowHas(rows, "v. rao"),
        successMessage: "V. Rao. Seven transfers, every one from the Central Store to the Municipal Records Office.",
        narrativeAfter:
          "KULKARNI: V. Rao — the same records officer who keeps sealing my files. He didn't steal the evidence. He signed it out the front door and into a building I can't touch. That's the pattern I needed. Superb work, Archivist. Now we go where the transfers point: the midnight exchange.",
      },
    ],
  },
  {
    id: 5,
    slug: "the-midnight-exchange",
    title: "The Midnight Exchange",
    subtitle: "INNER JOIN · LEFT JOIN",
    difficulty: "Senior Detective",
    concepts: ["INNER JOIN", "LEFT JOIN"],
    status: "available",
    teaser:
      "Two ledgers, kept apart on purpose. Join them and the couriers line up against the payments — and one name has no alibi on either side.",
    briefing:
      "The courier records and the payment records were never meant to be read together. Kept in separate offices, each looks innocent; laid side by side, they confess. By joining every courier to the accounts that funded them, Kulkarni can match each drop to the hand that paid for it — and, just as tellingly, spot the couriers nobody ever paid and the payments that answer to no courier at all. Use INNER JOIN to pair the records that match, and LEFT JOIN to expose the ones that don't. The transfers with no courier behind them are the midnight exchange — money moving to a name the ledgers refuse to print.",
    schema: {
      tables: [
        {
          name: "couriers",
          columns: [
            { name: "courier_id", type: "INTEGER", key: "PK" },
            { name: "courier_name", type: "TEXT" },
            { name: "home_port", type: "TEXT" },
            { name: "handler", type: "TEXT" },
            { name: "active", type: "INTEGER" },
          ],
        },
        {
          name: "payments",
          columns: [
            { name: "payment_id", type: "INTEGER", key: "PK" },
            { name: "courier_id", type: "INTEGER", key: "FK" },
            { name: "amount_inr", type: "INTEGER" },
            { name: "pay_date", type: "TEXT" },
            { name: "paid_by", type: "TEXT" },
            { name: "channel", type: "TEXT" },
          ],
          references: [{ column: "courier_id", refTable: "couriers", refColumn: "courier_id" }],
        },
      ],
    },
    quests: [
      { id: "5-q1", title: "Reading Both Ledgers", description: "Join the couriers to their payments and read the two registers as one.", objectiveIds: ["5-1", "5-2", "5-3"] },
      { id: "5-q2", title: "The Ones Left Out", description: "Keep every courier, paid or not, and see who the money never reached.", objectiveIds: ["5-4", "5-5", "5-6"] },
      { id: "5-q3", title: "Transfers Without a Face", description: "Surface the payments that answer to no courier at all.", objectiveIds: ["5-7", "5-8", "5-9", "5-10"] },
    ],
    objectives: [
      // OBJECTIVES_5
      {
        id: "5-1",
        title: "Match couriers to payments",
        description:
          "Join the couriers table to the payments table on courier_id, and list each courier's name beside the amount they were paid. Only couriers with a matching payment should appear. Use INNER JOIN ... ON c.courier_id = p.courier_id.",
        hint: "SELECT c.courier_name, p.amount_inr FROM couriers c JOIN payments p ON c.courier_id = p.courier_id.",
        questId: "5-q1",
        validationFn: (rows) => countIs(rows, 9) && anyRowHas(rows, "imtiaz"),
        successMessage: "Nine payments line up with a named courier. The other three don't — hold that thought.",
        narrativeAfter:
          "KULKARNI: Now the two ledgers read as one. Every rupee here has a face. Narrow it to the coast.",
      },
      {
        id: "5-2",
        title: "Payments to the Konkan couriers",
        description:
          "Join the tables and keep only the couriers whose home_port is 'Konkan Port', listing each name with the amount paid. Use INNER JOIN with WHERE c.home_port = 'Konkan Port'.",
        hint: "SELECT c.courier_name, p.amount_inr FROM couriers c JOIN payments p ON c.courier_id = p.courier_id WHERE c.home_port = 'Konkan Port'.",
        questId: "5-q1",
        validationFn: (rows) => countIs(rows, 4) && anyRowHas(rows, "imtiaz"),
        successMessage: "Four payments run to the Konkan Port men — Imtiaz Sayed and Ravi Teja, both on Meridian's account.",
        narrativeAfter:
          "KULKARNI: The coast couriers again. Add up what each one carried across the whole ledger.",
      },
      {
        id: "5-3",
        title: "Total paid per courier",
        description:
          "Join the tables, group by courier, and sum each courier's payments. Return one row per courier with a matching payment. Use INNER JOIN with GROUP BY c.courier_name and SUM(p.amount_inr).",
        hint: "SELECT c.courier_name, SUM(p.amount_inr) FROM couriers c JOIN payments p ON c.courier_id = p.courier_id GROUP BY c.courier_name.",
        questId: "5-q1",
        validationFn: (rows) => countIs(rows, 6) && anyRowHas(rows, "imtiaz"),
        successMessage: "Six couriers drew money. Imtiaz Sayed leads them — over ₹11 lakh across two runs.",
        narrativeAfter:
          "KULKARNI: Six names took payment. But a courier who's paid nothing is still a courier. Show me all of them.",
      },
      // OBJECTIVES_5_MID
      {
        id: "5-4",
        title: "Every courier, paid or not",
        description:
          "Now keep every courier on the roster, even those with no payment. LEFT JOIN couriers to payments so unpaid couriers still appear (with a null amount). List courier_name and amount_inr. Use couriers c LEFT JOIN payments p ON c.courier_id = p.courier_id.",
        hint: "SELECT c.courier_name, p.amount_inr FROM couriers c LEFT JOIN payments p ON c.courier_id = p.courier_id.",
        questId: "5-q2",
        validationFn: (rows) => countIs(rows, 11),
        successMessage: "Eleven rows — nine payments plus two couriers the money skipped entirely.",
        narrativeAfter:
          "KULKARNI: A LEFT JOIN keeps the ones an INNER JOIN throws away. Two couriers came back with nothing beside their name. Who are they?",
      },
      {
        id: "5-5",
        title: "The couriers nobody paid",
        description:
          "From the LEFT JOIN, keep only the couriers with no matching payment — the rows where the payment side is null. List their names. Use LEFT JOIN with WHERE p.payment_id IS NULL.",
        hint: "SELECT c.courier_name FROM couriers c LEFT JOIN payments p ON c.courier_id = p.courier_id WHERE p.payment_id IS NULL.",
        questId: "5-q2",
        validationFn: (rows) => countIs(rows, 2) && anyRowHas(rows, "anwar"),
        successMessage: "Anwar Sheikh and Yusuf Dalvi — on the books as couriers, but never paid a rupee through this ledger.",
        narrativeAfter:
          "KULKARNI: Unpaid couriers. Either they work for love, or they're paid somewhere these books don't reach. Count every courier's payments, zeros included.",
      },
      {
        id: "5-6",
        title: "Payment count per courier",
        description:
          "Using the LEFT JOIN, count how many payments each courier received — the unpaid ones should show zero. Return one row per courier. Use LEFT JOIN with GROUP BY c.courier_name and COUNT(p.payment_id).",
        hint: "SELECT c.courier_name, COUNT(p.payment_id) FROM couriers c LEFT JOIN payments p ON c.courier_id = p.courier_id GROUP BY c.courier_name.",
        questId: "5-q2",
        validationFn: (rows) => countIs(rows, 8) && anyRowHas(rows, "anwar"),
        successMessage: "All eight couriers, with their tallies — and two hard zeros where the money never landed.",
        narrativeAfter:
          "KULKARNI: Eight couriers accounted for. Now turn the join around. Some payments have no courier at all — find them.",
      },
      // OBJECTIVES_5_END
      {
        id: "5-7",
        title: "Payments with no courier",
        description:
          "Turn the LEFT JOIN around: start from payments and keep only the ones whose courier_id matches no courier on the roster. Return those payment rows. Use payments p LEFT JOIN couriers c ON p.courier_id = c.courier_id WHERE c.courier_id IS NULL.",
        hint: "SELECT p.* FROM payments p LEFT JOIN couriers c ON p.courier_id = c.courier_id WHERE c.courier_id IS NULL.",
        questId: "5-q3",
        validationFn: (rows) => countIs(rows, 3),
        successMessage: "Three payments answer to no courier — two to a phantom id, one to nobody at all.",
        narrativeAfter:
          "KULKARNI: Three transfers with no one to carry them. That's the midnight exchange. What are they worth together?",
      },
      {
        id: "5-8",
        title: "The weight of the phantom transfers",
        description:
          "Total the amount_inr of those faceless payments — the ones with no matching courier. Return the sum. Use the same LEFT JOIN with SUM(p.amount_inr) and WHERE c.courier_id IS NULL.",
        hint: "SELECT SUM(p.amount_inr) FROM payments p LEFT JOIN couriers c ON p.courier_id = c.courier_id WHERE c.courier_id IS NULL.",
        questId: "5-q3",
        validationFn: (rows) => scalarIs(rows, 1710000),
        successMessage: "₹17.1 lakh moved through couriers who don't exist. That money went somewhere.",
        narrativeAfter:
          "KULKARNI: Seventeen lakh, paid to no one. Money doesn't vanish — it changes hands. Whose hands signed for it?",
      },
      {
        id: "5-9",
        title: "Who funded the phantoms",
        description:
          "Group the faceless payments by who paid them (paid_by) and count each. Return one row per payer. Use the LEFT JOIN with WHERE c.courier_id IS NULL, GROUP BY p.paid_by.",
        hint: "SELECT p.paid_by, COUNT(*) FROM payments p LEFT JOIN couriers c ON p.courier_id = c.courier_id WHERE c.courier_id IS NULL GROUP BY p.paid_by.",
        questId: "5-q3",
        validationFn: (rows) => countIs(rows, 1) && anyRowHas(rows, "meridian holdings"),
        successMessage: "One payer, all three: Meridian Holdings. The same faceless company from the hotel register.",
        narrativeAfter:
          "KULKARNI: Meridian again — paying couriers who aren't there. Now give me the single largest run that does have a name.",
      },
      {
        id: "5-10",
        title: "The biggest named exchange",
        description:
          "Across the matched payments, find the single highest-value payment and the courier who took it. Join, sort by amount, and keep the top row. Use INNER JOIN with ORDER BY p.amount_inr DESC LIMIT 1.",
        hint: "SELECT c.courier_name, p.amount_inr FROM couriers c JOIN payments p ON c.courier_id = p.courier_id ORDER BY p.amount_inr DESC LIMIT 1.",
        questId: "5-q3",
        validationFn: (rows) => countIs(rows, 1) && anyRowHas(rows, "imtiaz"),
        successMessage: "Imtiaz Sayed — ₹9 lakh in a single night, Meridian's money, Konkan Port's courier.",
        narrativeAfter:
          "KULKARNI: Imtiaz carries the largest named drop; the largest faceless ones go to no one at all. Both trails run through Meridian Holdings — and Meridian's paper is cleared by the records office. We're one shipment away from the name. Excellent work, Archivist.",
      },
    ],
  },
  {
    id: 6,
    slug: "the-auction-house",
    title: "The Auction House",
    subtitle: "SELF JOIN · UNION",
    difficulty: "Senior Detective",
    concepts: ["SELF JOIN", "UNION"],
    status: "available",
    teaser:
      "At the Devgarh auction house, bidders bid against their own shells. Pair each bid with its rival and the ring bids surface; union the buyers and sellers and the same faces appear on both lists.",
    briefing:
      "The auction house on the Chowk is where laundered money changes shape — a crate of contraband becomes a 'colonial teak chest' with a clean receipt. The trick is the bidding: shell buyers, all funded by the same backer, bid one another up so a lot 'sells' for whatever price the ring needs it to. A SELF JOIN pairs bids on the same lot to expose those rings, matching the bids table against itself. A UNION then stacks the sellers and the bidders into a single roster — and the names that appear on both sides give the game away. Use SELF JOIN to find the collusion and UNION to build the roster.",
    schema: {
      tables: [
        {
          name: "auction_lots",
          columns: [
            { name: "lot_id", type: "INTEGER", key: "PK" },
            { name: "title", type: "TEXT" },
            { name: "seller", type: "TEXT" },
            { name: "hammer_inr", type: "INTEGER" },
            { name: "sale_date", type: "TEXT" },
            { name: "category", type: "TEXT" },
          ],
        },
        {
          name: "bids",
          columns: [
            { name: "bid_id", type: "INTEGER", key: "PK" },
            { name: "lot_id", type: "INTEGER", key: "FK" },
            { name: "bidder", type: "TEXT" },
            { name: "backer", type: "TEXT" },
            { name: "bid_amount", type: "INTEGER" },
          ],
          references: [{ column: "lot_id", refTable: "auction_lots", refColumn: "lot_id" }],
        },
      ],
    },
    quests: [
      { id: "6-q1", title: "The Bidding Floor", description: "Join the bids table to itself and pair the rivals on each lot.", objectiveIds: ["6-1", "6-2", "6-3"] },
      { id: "6-q2", title: "Everyone in the Room", description: "Union the sellers and the bidders into one roster of the whole house.", objectiveIds: ["6-4", "6-5", "6-6"] },
      { id: "6-q3", title: "The Ring Exposed", description: "Combine the tools until the colluding backer and the propped-up lot stand out.", objectiveIds: ["6-7", "6-8", "6-9", "6-10"] },
    ],
    objectives: [
      // OBJECTIVES_6
      {
        id: "6-1",
        title: "Rivals on every lot",
        description:
          "Join the bids table to itself to find every pair of bidders who bid on the same lot. Match a.lot_id = b.lot_id and keep a.bidder < b.bidder so each pair appears once. Return both bidders and the lot_id.",
        hint: "SELECT a.bidder, b.bidder, a.lot_id FROM bids a JOIN bids b ON a.lot_id = b.lot_id AND a.bidder < b.bidder.",
        questId: "6-q1",
        validationFn: (rows) => countIs(rows, 8),
        successMessage: "Eight head-to-head contests across the room. Some of them, it turns out, were staged.",
        narrativeAfter:
          "KULKARNI: A table joined to itself — every bidder set against every rival on their lot. Now zoom in on the dearest lot.",
      },
      {
        id: "6-2",
        title: "The fight for the portrait",
        description:
          "Using the same self join, keep only the rival pairs on lot 4 — the unsigned portrait. Add WHERE a.lot_id = 4. Return the two bidders.",
        hint: "SELECT a.bidder, b.bidder FROM bids a JOIN bids b ON a.lot_id = b.lot_id AND a.bidder < b.bidder WHERE a.lot_id = 4.",
        questId: "6-q1",
        validationFn: (rows) => countIs(rows, 3) && anyRowHas(rows, "tara"),
        successMessage: "Three bidders circled the ₹12 lakh portrait — V. Rao's own consignment.",
        narrativeAfter:
          "KULKARNI: Three rivals on one lot. But rivals who share a paymaster aren't rivals at all. Match them on their backer.",
      },
      {
        id: "6-3",
        title: "Bidding against yourself",
        description:
          "Refine the self join: keep pairs on the same lot that also share the same backer (a.backer = b.backer), with a.bidder < b.bidder. Those are shell bidders propping up a price. Return both bidders and the backer.",
        hint: "SELECT a.bidder, b.bidder, a.backer FROM bids a JOIN bids b ON a.lot_id = b.lot_id AND a.backer = b.backer AND a.bidder < b.bidder.",
        questId: "6-q1",
        validationFn: (rows) => countIs(rows, 3) && anyRowHas(rows, "meridian"),
        successMessage: "Three ring pairs — the same backer bidding against itself to force the hammer up.",
        narrativeAfter:
          "KULKARNI: There it is. Bidders with one hand in the same pocket. Now step back and list everyone in the room.",
      },
      // OBJECTIVES_6_MID
      {
        id: "6-4",
        title: "The whole roster",
        description:
          "Build one deduplicated list of everyone in the auction: the sellers from auction_lots and the bidders from bids. Use UNION to stack the two columns — it removes duplicates automatically. Alias the column AS name.",
        hint: "SELECT seller AS name FROM auction_lots UNION SELECT bidder FROM bids.",
        questId: "6-q2",
        validationFn: (rows) => countIs(rows, 14),
        successMessage: "Fourteen distinct names in the house — and one of them sits on both lists.",
        narrativeAfter:
          "KULKARNI: UNION folds two columns into one and drops the repeats. Fourteen names. Now count every appearance, repeats and all.",
      },
      {
        id: "6-5",
        title: "Every appearance counted",
        description:
          "Now keep the duplicates. Stack the same two columns with UNION ALL, which does not deduplicate, so every seller-row and every bid-row is counted. Return the combined column.",
        hint: "SELECT seller FROM auction_lots UNION ALL SELECT bidder FROM bids.",
        questId: "6-q2",
        validationFn: (rows) => countIs(rows, 18),
        successMessage: "Eighteen appearances in total — six lots offered, twelve bids placed. UNION ALL keeps them all.",
        narrativeAfter:
          "KULKARNI: The gap between fourteen names and eighteen appearances is where the repeats hide. Label each side and find the face on both.",
      },
      {
        id: "6-6",
        title: "Which side each name plays",
        description:
          "Tag every name with its role. Select seller with the literal 'Seller' AS role, UNION with bidder tagged 'Bidder'. A name that plays both sides appears twice — once per role.",
        hint: "SELECT seller AS name, 'Seller' AS role FROM auction_lots UNION SELECT bidder, 'Bidder' FROM bids.",
        questId: "6-q2",
        validationFn: (rows) => countIs(rows, 15) && anyRowHas(rows, "devgarh estate"),
        successMessage: "Devgarh Estate sells one lot and bids on another — the same name working both sides of the room.",
        narrativeAfter:
          "KULKARNI: A seller who's also a buyer. That's not investing — that's washing. Now weigh the sellers themselves.",
      },
      // OBJECTIVES_6_END
      {
        id: "6-7",
        title: "Sellers with more than one lot",
        description:
          "Which sellers put up more than one lot? Group auction_lots by seller and keep only those with more than one. Use GROUP BY seller with HAVING COUNT(*) > 1.",
        hint: "SELECT seller, COUNT(*) FROM auction_lots GROUP BY seller HAVING COUNT(*) > 1.",
        questId: "6-q3",
        validationFn: (rows) => countIs(rows, 2) && anyRowHas(rows, "rao"),
        successMessage: "Two repeat sellers: V. Rao and Meridian Holdings — the same pair behind everything.",
        narrativeAfter:
          "KULKARNI: Rao and Meridian, again, side by side. Total up what each seller's lots fetched.",
      },
      {
        id: "6-8",
        title: "The takings per seller",
        description:
          "Sum the hammer_inr each seller earned across their lots, and order from highest to lowest. Alias the sum AS total. Use GROUP BY seller with ORDER BY total DESC.",
        hint: "SELECT seller, SUM(hammer_inr) AS total FROM auction_lots GROUP BY seller ORDER BY total DESC.",
        questId: "6-q3",
        validationFn: (rows) =>
          countIs(rows, 4) && isSorted(rows, "total", "desc") && firstRowHas(rows, "rao"),
        successMessage: "V. Rao clears ₹16.5 lakh at the top — a records clerk with an antique dealer's income.",
        narrativeAfter:
          "KULKARNI: Rao's 'antiques' out-earn everyone. Now count how many ring bids each backer ran.",
      },
      {
        id: "6-9",
        title: "The backer behind the rings",
        description:
          "Take the ring-pair self join from before and group it by backer, counting the colluding pairs each one ran. Use the self join (same lot, same backer, a.bidder < b.bidder) with GROUP BY a.backer.",
        hint: "SELECT a.backer, COUNT(*) FROM bids a JOIN bids b ON a.lot_id = b.lot_id AND a.backer = b.backer AND a.bidder < b.bidder GROUP BY a.backer.",
        questId: "6-q3",
        validationFn: (rows) => countIs(rows, 2) && anyRowHas(rows, "meridian"),
        successMessage: "Two backers ran rings — but Meridian Holdings ran twice as many as anyone else.",
        narrativeAfter:
          "KULKARNI: Meridian is the ring's engine. One last look — which lot did they prop up hardest?",
      },
      {
        id: "6-10",
        title: "The propped-up lot",
        description:
          "Find the ring pair on lot 4 specifically — the shell bidders sharing a backer who fought over V. Rao's portrait. Use the ring self join with WHERE a.lot_id = 4. Return both bidders.",
        hint: "SELECT a.bidder, b.bidder FROM bids a JOIN bids b ON a.lot_id = b.lot_id AND a.backer = b.backer AND a.bidder < b.bidder WHERE a.lot_id = 4.",
        questId: "6-q3",
        validationFn: (rows) => countIs(rows, 1) && anyRowHas(rows, "ovais"),
        successMessage: "Deepak Rao and Ovais Khan — both Meridian shells — drove V. Rao's portrait to ₹12 lakh.",
        narrativeAfter:
          "KULKARNI: Meridian's shells bid up V. Rao's own lot. Rao consigns, Meridian inflates, the money comes out clean and Rao takes his cut on paper. The auction's a laundry — and every ticket runs through the records office. One shipment left to trace. Sharp work, Archivist.",
      },
    ],
  },
  {
    id: 7,
    slug: "the-phantom-shipment",
    title: "The Phantom Shipment",
    subtitle: "Subqueries · EXISTS",
    difficulty: "Chief Inspector",
    concepts: ["Subqueries", "EXISTS"],
    status: "available",
    teaser:
      "A container that customs cleared but no ship ever carried. Nest the queries, test for what EXISTS, and the phantom shipment gives up the forger who signed it through.",
    briefing:
      "Konkan Port's customs house clears cargo against manifests, and the docks log what actually arrives. The two should agree. They don't. Somewhere in the paperwork is a phantom shipment — a manifest cleared, valued, and stamped, for goods no vessel ever unloaded. To catch it, Kulkarni nests one query inside another: a subquery asks 'which manifests actually arrived?', and EXISTS (and its opposite, NOT EXISTS) tests each clearance against that answer. The clearances with nothing behind them are forged — and one signature is on every last one. Use subqueries and EXISTS to separate the real cargo from the paper ghosts.",
    schema: {
      tables: [
        {
          name: "clearances",
          columns: [
            { name: "clearance_id", type: "INTEGER", key: "PK" },
            { name: "manifest_ref", type: "TEXT" },
            { name: "cleared_by", type: "TEXT" },
            { name: "clearance_date", type: "TEXT" },
            { name: "declared_value_inr", type: "INTEGER" },
            { name: "vessel", type: "TEXT" },
          ],
        },
        {
          name: "arrivals",
          columns: [
            { name: "arrival_id", type: "INTEGER", key: "PK" },
            { name: "manifest_ref", type: "TEXT" },
            { name: "dock", type: "TEXT" },
            { name: "arrival_date", type: "TEXT" },
            { name: "vessel", type: "TEXT" },
          ],
          references: [{ column: "manifest_ref", refTable: "clearances", refColumn: "manifest_ref" }],
        },
      ],
    },
    quests: [
      { id: "7-q1", title: "Reading the Manifests", description: "Use subqueries to sort the clearances that match an arrival from the ones that don't.", objectiveIds: ["7-1", "7-2", "7-3"] },
      { id: "7-q2", title: "What Never Arrived", description: "Test each clearance with EXISTS and NOT EXISTS to isolate the phantoms.", objectiveIds: ["7-4", "7-5", "7-6"] },
      { id: "7-q3", title: "The Forger", description: "Nest the queries until the signature and the ghost ships behind the phantoms surface.", objectiveIds: ["7-7", "7-8", "7-9", "7-10"] },
    ],
    objectives: [
      // OBJECTIVES_7
      {
        id: "7-1",
        title: "The high-value clearances",
        description:
          "Find the clearances whose declared_value_inr is above the average across all clearances. Put the average in a scalar subquery: WHERE declared_value_inr > (SELECT AVG(declared_value_inr) FROM clearances).",
        hint: "SELECT * FROM clearances WHERE declared_value_inr > (SELECT AVG(declared_value_inr) FROM clearances).",
        questId: "7-q1",
        validationFn: (rows) => countIs(rows, 4) && anyRowHas(rows, "bhatt"),
        successMessage: "Four clearances tower over the average — and every one of them was signed by Anil Bhatt.",
        narrativeAfter:
          "KULKARNI: A subquery works out the average first, then the outer query measures against it. Bhatt's paperwork runs rich. Now, which of these actually arrived?",
      },
      {
        id: "7-2",
        title: "Clearances that match an arrival",
        description:
          "Keep only the clearances whose manifest_ref appears in the arrivals log. Use an IN subquery: WHERE manifest_ref IN (SELECT manifest_ref FROM arrivals).",
        hint: "SELECT * FROM clearances WHERE manifest_ref IN (SELECT manifest_ref FROM arrivals).",
        questId: "7-q1",
        validationFn: (rows) => countIs(rows, 8),
        successMessage: "Eight clearances line up with real cargo on the docks. That leaves the rest unaccounted for.",
        narrativeAfter:
          "KULKARNI: IN checks each manifest against the list of ones that arrived. Now flip it — show me the clearances with no ship behind them.",
      },
      {
        id: "7-3",
        title: "Cleared, but never landed",
        description:
          "Now keep the clearances whose manifest_ref is NOT in the arrivals log — cargo cleared on paper that no dock ever received. Use WHERE manifest_ref NOT IN (SELECT manifest_ref FROM arrivals).",
        hint: "SELECT * FROM clearances WHERE manifest_ref NOT IN (SELECT manifest_ref FROM arrivals).",
        questId: "7-q1",
        validationFn: (rows) => countIs(rows, 3) && anyRowHas(rows, "bhatt"),
        successMessage: "Three clearances for shipments that never came — all three stamped by Anil Bhatt.",
        narrativeAfter:
          "KULKARNI: Three ghosts. NOT IN is the inverse of IN. But there's a sharper tool for 'is there a match at all' — EXISTS. Try it.",
      },
      // OBJECTIVES_7_MID
      {
        id: "7-4",
        title: "Matched by EXISTS",
        description:
          "Get the same matched clearances a different way. For each clearance, test whether a matching arrival EXISTS. Use a correlated subquery: WHERE EXISTS (SELECT 1 FROM arrivals a WHERE a.manifest_ref = clearances.manifest_ref).",
        hint: "SELECT * FROM clearances c WHERE EXISTS (SELECT 1 FROM arrivals a WHERE a.manifest_ref = c.manifest_ref).",
        questId: "7-q2",
        validationFn: (rows) => countIs(rows, 8),
        successMessage: "Eight again — EXISTS reaches the same truth as IN, one clearance at a time.",
        narrativeAfter:
          "KULKARNI: EXISTS asks the inner query, for each row, 'is there even one match?' — and stops the moment it finds one. Now negate it.",
      },
      {
        id: "7-5",
        title: "The phantoms, by NOT EXISTS",
        description:
          "Isolate the phantom clearances with NOT EXISTS — the clearances for which no matching arrival exists. Use WHERE NOT EXISTS (SELECT 1 FROM arrivals a WHERE a.manifest_ref = clearances.manifest_ref).",
        hint: "SELECT * FROM clearances c WHERE NOT EXISTS (SELECT 1 FROM arrivals a WHERE a.manifest_ref = c.manifest_ref).",
        questId: "7-q2",
        validationFn: (rows) => countIs(rows, 3) && anyRowHas(rows, "bhatt"),
        successMessage: "The same three phantoms, isolated by NOT EXISTS. Bhatt's signature on every one.",
        narrativeAfter:
          "KULKARNI: The paper ghosts. But paper cuts both ways — is there cargo that arrived with no clearance at all?",
      },
      {
        id: "7-6",
        title: "Landed off the books",
        description:
          "Turn the test around: find arrivals with no matching clearance — real cargo that slipped in with no paperwork. Use WHERE NOT EXISTS (SELECT 1 FROM clearances c WHERE c.manifest_ref = arrivals.manifest_ref).",
        hint: "SELECT * FROM arrivals a WHERE NOT EXISTS (SELECT 1 FROM clearances c WHERE c.manifest_ref = a.manifest_ref).",
        questId: "7-q2",
        validationFn: (rows) => countIs(rows, 1) && anyRowHas(rows, "m-108"),
        successMessage: "One shipment, M-108, docked at Kadambari with no clearance behind it — smuggled in clean.",
        narrativeAfter:
          "KULKARNI: Ghosts cleared that never came; cargo that came and was never cleared. Both run through the same house. Now name the hand behind the phantoms.",
      },
      // OBJECTIVES_7_END
      {
        id: "7-7",
        title: "Who signed the ghosts",
        description:
          "Among the phantom clearances only (manifest not in arrivals), group by cleared_by and count each. Combine the NOT IN subquery with GROUP BY: WHERE manifest_ref NOT IN (SELECT manifest_ref FROM arrivals) GROUP BY cleared_by.",
        hint: "SELECT cleared_by, COUNT(*) FROM clearances WHERE manifest_ref NOT IN (SELECT manifest_ref FROM arrivals) GROUP BY cleared_by.",
        questId: "7-q3",
        validationFn: (rows) => countIs(rows, 1) && anyRowHas(rows, "bhatt"),
        successMessage: "One name clears every phantom: Anil Bhatt, three for three.",
        narrativeAfter:
          "KULKARNI: Bhatt alone. Not one honest officer's name among the ghosts. Now total what he waved through.",
      },
      {
        id: "7-8",
        title: "The value of thin air",
        description:
          "Sum the declared_value_inr of the phantom clearances — the value stamped onto cargo that never existed. Use SUM with the NOT IN subquery: WHERE manifest_ref NOT IN (SELECT manifest_ref FROM arrivals).",
        hint: "SELECT SUM(declared_value_inr) FROM clearances WHERE manifest_ref NOT IN (SELECT manifest_ref FROM arrivals).",
        questId: "7-q3",
        validationFn: (rows) => scalarIs(rows, 5500000),
        successMessage: "₹55 lakh of declared value, backed by nothing but Bhatt's stamp.",
        narrativeAfter:
          "KULKARNI: Fifty-five lakh conjured from paper. Which single ghost was valued highest?",
      },
      {
        id: "7-9",
        title: "The biggest ghost",
        description:
          "From the phantom clearances, return the single one with the highest declared_value_inr. Use the NOT IN subquery with ORDER BY declared_value_inr DESC LIMIT 1.",
        hint: "SELECT * FROM clearances WHERE manifest_ref NOT IN (SELECT manifest_ref FROM arrivals) ORDER BY declared_value_inr DESC LIMIT 1.",
        questId: "7-q3",
        validationFn: (rows) => countIs(rows, 1) && anyRowHas(rows, "m-203"),
        successMessage: "M-203 — ₹22 lakh, aboard a ship called MV Ghost. The name wasn't even trying to hide.",
        narrativeAfter:
          "KULKARNI: MV Ghost. Let's see how many of Bhatt's vessels are as fictional as their cargo.",
      },
      {
        id: "7-10",
        title: "Ships that never sailed",
        description:
          "Find the vessels named on clearances that never appear in the arrivals log — the fictional ships. Use a subquery: SELECT DISTINCT vessel FROM clearances WHERE vessel NOT IN (SELECT vessel FROM arrivals).",
        hint: "SELECT DISTINCT vessel FROM clearances WHERE vessel NOT IN (SELECT vessel FROM arrivals).",
        questId: "7-q3",
        validationFn: (rows) => countIs(rows, 2) && anyRowHas(rows, "phantom"),
        successMessage: "MV Phantom and MV Ghost — two ships no harbour ever logged, carrying ₹55 lakh of nothing.",
        narrativeAfter:
          "KULKARNI: Bhatt forged the clearances, invented the ships, and priced the empty air. But a customs agent doesn't set up a laundering pipeline alone — he's paid, and he's protected. The man who protects him signs the transfers, seals the files, and consigns the auctions: V. Rao. Everything points home now. One ledger left to open. Exceptional work, Archivist.",
      },
    ],
  },
  {
    id: 8,
    slug: "the-black-ledger",
    title: "The Black Ledger",
    subtitle: "CTEs · Window Functions",
    difficulty: "Chief Inspector",
    concepts: ["CTEs", "Window Functions"],
    status: "available",
    teaser:
      "Every thread — the fire, the courier, the precinct, the auction, the phantom — runs into one ledger and one signature. Build the final query and name the administrator behind it all.",
    briefing:
      "One ledger survived the fire that opened this whole case: a master record of every laundered flow, each entry stamped with the official who authorised it and the channel it moved through — transfers, couriers, the auction house, the customs desk. Kulkarni hands it to you to close the case for good. Layer the evidence with common table expressions (WITH), so each step builds on the last, and use window functions — RANK, running SUM, share-of-total — to rank the players and expose the one name that touches every channel and sits atop every total. This is the accusation, and it must be built from the data, not asserted. Use CTEs and window functions to name the administrator at the center of the Black Ledger.",
    schema: {
      tables: [
        {
          name: "ledger_entries",
          columns: [
            { name: "entry_id", type: "INTEGER", key: "PK" },
            { name: "entry_date", type: "TEXT" },
            { name: "channel", type: "TEXT" },
            { name: "authorised_by", type: "TEXT" },
            { name: "amount_inr", type: "INTEGER" },
            { name: "counterparty", type: "TEXT" },
          ],
        },
      ],
    },
    quests: [
      { id: "8-q1", title: "Ranking the Flows", description: "Use window functions to rank the ledger entries and total them as they run.", objectiveIds: ["8-1", "8-2", "8-3"] },
      { id: "8-q2", title: "Layering the Evidence", description: "Build common table expressions that total each authoriser and measure their reach.", objectiveIds: ["8-4", "8-5", "8-6"] },
      { id: "8-q3", title: "The Black Ledger", description: "Combine CTEs and window functions until one signature stands alone at the center.", objectiveIds: ["8-7", "8-8", "8-9", "8-10"] },
    ],
    objectives: [
      // OBJECTIVES_8
      {
        id: "8-1",
        title: "Rank the flows",
        description:
          "Rank every ledger entry by amount_inr, largest first, showing the authoriser and a rank column. Use a window function: RANK() OVER (ORDER BY amount_inr DESC) AS rnk, then ORDER BY rnk.",
        hint: "SELECT authorised_by, amount_inr, RANK() OVER (ORDER BY amount_inr DESC) AS rnk FROM ledger_entries ORDER BY rnk.",
        questId: "8-q1",
        validationFn: (rows) => countIs(rows, 12) && firstRowHas(rows, "bhatt"),
        successMessage: "Twelve flows ranked. The single largest — ₹22 lakh — is Bhatt's phantom, but the size of one entry hides who moves the most overall.",
        narrativeAfter:
          "KULKARNI: A window function ranks each row against the others without collapsing them into groups. One big shipment tops the list — but a launderer's power is in the total, not one entry. Add them up as they run.",
      },
      {
        id: "8-2",
        title: "The running total",
        description:
          "Show each entry by date with a running total of amount_inr accumulating over time. Use SUM(amount_inr) OVER (ORDER BY entry_date, entry_id) AS running, and ORDER BY entry_date, entry_id.",
        hint: "SELECT entry_date, amount_inr, SUM(amount_inr) OVER (ORDER BY entry_date, entry_id) AS running FROM ledger_entries ORDER BY entry_date, entry_id.",
        questId: "8-q1",
        validationFn: (rows) => countIs(rows, 12) && anyRowHas(rows, "14380000"),
        successMessage: "The ledger climbs to ₹1.43 crore by the last entry — the full weight of the conspiracy in one running column.",
        narrativeAfter:
          "KULKARNI: A window SUM with ORDER BY totals as it goes, so you watch the money pile up. ₹1.43 crore through one office. Now rank them inside each channel.",
      },
      {
        id: "8-3",
        title: "Top of every channel",
        description:
          "Rank the entries within each channel separately, largest amount first. Partition the window: RANK() OVER (PARTITION BY channel ORDER BY amount_inr DESC) AS rnk, then ORDER BY channel, rnk.",
        hint: "SELECT channel, authorised_by, amount_inr, RANK() OVER (PARTITION BY channel ORDER BY amount_inr DESC) AS rnk FROM ledger_entries ORDER BY channel, rnk.",
        questId: "8-q1",
        validationFn: (rows) => countIs(rows, 12) && firstRowHas(rows, "rao"),
        successMessage: "Partitioning restarts the rank per channel — and V. Rao tops the auction flows, the very channel his office consigns.",
        narrativeAfter:
          "KULKARNI: PARTITION BY splits the ranking channel by channel. Rao keeps surfacing. Time to stop looking at single rows and layer the evidence properly.",
      },
      // OBJECTIVES_8_MID
      {
        id: "8-4",
        title: "Total per authoriser",
        description:
          "Using a common table expression, total the amount_inr each authoriser signed off, ordered largest first. Define WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by), then SELECT * FROM totals ORDER BY total DESC.",
        hint: "WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT * FROM totals ORDER BY total DESC.",
        questId: "8-q2",
        validationFn: (rows) => countIs(rows, 6) && firstRowHas(rows, "rao"),
        successMessage: "Six authorisers on the ledger — and V. Rao sits at the top with ₹63.5 lakh, nearly double the next name.",
        narrativeAfter:
          "KULKARNI: A CTE with WITH names an intermediate result you can query as if it were a table. Rao leads. Now keep only the big movers.",
      },
      {
        id: "8-5",
        title: "The big movers",
        description:
          "From that same totals CTE, keep only the authorisers whose total exceeds ₹20 lakh (2000000), largest first. Reuse the CTE, then WHERE total > 2000000 ORDER BY total DESC.",
        hint: "WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT * FROM totals WHERE total > 2000000 ORDER BY total DESC.",
        questId: "8-q2",
        validationFn: (rows) => countIs(rows, 2) && firstRowHas(rows, "rao"),
        successMessage: "Only two clear ₹20 lakh: V. Rao and Anil Bhatt — the head and the hand.",
        narrativeAfter:
          "KULKARNI: Filter the CTE like any table. Two names carry the weight. But money is only half of it — measure how far each one reaches.",
      },
      {
        id: "8-6",
        title: "The widest reach",
        description:
          "Count how many distinct channels each authoriser operates in, widest reach first. Use a CTE: WITH reach AS (SELECT authorised_by, COUNT(DISTINCT channel) AS channels FROM ledger_entries GROUP BY authorised_by), then SELECT * FROM reach ORDER BY channels DESC.",
        hint: "WITH reach AS (SELECT authorised_by, COUNT(DISTINCT channel) AS channels FROM ledger_entries GROUP BY authorised_by) SELECT * FROM reach ORDER BY channels DESC.",
        questId: "8-q2",
        validationFn: (rows) => countIs(rows, 6) && firstRowHas(rows, "rao"),
        successMessage: "Every other name works one or two channels. V. Rao works all four — transfers, couriers, auctions, and customs.",
        narrativeAfter:
          "KULKARNI: Reach is the tell. A courier moves couriers' money. Rao moves everyone's. Now put the totals and the ranks together and name him.",
      },
      // OBJECTIVES_8_END
      {
        id: "8-7",
        title: "Rank the totals",
        description:
          "Feed the per-authoriser totals into a window function to rank them. Layer it: WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT authorised_by, total, RANK() OVER (ORDER BY total DESC) AS rnk FROM totals ORDER BY rnk.",
        hint: "WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT authorised_by, total, RANK() OVER (ORDER BY total DESC) AS rnk FROM totals ORDER BY rnk.",
        questId: "8-q3",
        validationFn: (rows) => countIs(rows, 6) && firstRowHas(rows, "rao"),
        successMessage: "A CTE feeding a window function — the totals ranked in one pass. Rank one: V. Rao.",
        narrativeAfter:
          "KULKARNI: This is the shape of the whole case — build the evidence in a CTE, then rank it with a window. Now isolate rank one alone.",
      },
      {
        id: "8-8",
        title: "The name at rank one",
        description:
          "Return only the single top-ranked authoriser by total. A window function can't sit in WHERE, so nest two CTEs: totals, then ranked (with the RANK), then SELECT * FROM ranked WHERE rnk = 1.",
        hint: "WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by), ranked AS (SELECT authorised_by, total, RANK() OVER (ORDER BY total DESC) AS rnk FROM totals) SELECT * FROM ranked WHERE rnk = 1.",
        questId: "8-q3",
        validationFn: (rows) => countIs(rows, 1) && anyRowHas(rows, "rao"),
        successMessage: "One row. One name. V. Rao — the largest single mover of money in the Black Ledger.",
        narrativeAfter:
          "KULKARNI: Chain CTEs to filter on a window result — compute the rank in one layer, filter it in the next. Now prove he's not just the biggest, but the only one everywhere.",
      },
      {
        id: "8-9",
        title: "The one in every channel",
        description:
          "Name the authoriser who operates in all four channels. Use a CTE: WITH reach AS (SELECT authorised_by, COUNT(DISTINCT channel) AS channels, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT * FROM reach WHERE channels = 4.",
        hint: "WITH reach AS (SELECT authorised_by, COUNT(DISTINCT channel) AS channels, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT * FROM reach WHERE channels = 4.",
        questId: "8-q3",
        validationFn: (rows) => countIs(rows, 1) && anyRowHas(rows, "rao"),
        successMessage: "Exactly one name spans transfers, couriers, auctions, and customs: V. Rao. The spider sitting in the whole web.",
        narrativeAfter:
          "KULKARNI: No courier, no agent, no shell touches all four. Only the office that files every one of them. One number left — how much of the ledger is his.",
      },
      {
        id: "8-10",
        title: "The Black Ledger closes",
        description:
          "For the finale, show each authoriser's total and their share of the entire ledger as a percentage, largest first. Use a window over the whole set: WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT authorised_by, total, ROUND(total * 100.0 / SUM(total) OVER (), 1) AS pct FROM totals ORDER BY total DESC.",
        hint: "WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT authorised_by, total, ROUND(total * 100.0 / SUM(total) OVER (), 1) AS pct FROM totals ORDER BY total DESC.",
        questId: "8-q3",
        validationFn: (rows) => countIs(rows, 6) && firstRowHas(rows, "rao") && anyRowHas(rows, "44.2"),
        successMessage: "V. Rao moved 44.2% of the entire Black Ledger — more than every courier, agent, and shell company combined. The case is made.",
        narrativeAfter:
          "KULKARNI: SUM() OVER () with no partition totals the whole column, so each row divides against the grand total. Forty-four percent through one desk at the records office. That's not an administrator caught in a conspiracy, Archivist — that's the administrator running it. V. Rao. Vasudev Rao. Write the warrant. The Black Ledger is closed, and you closed it. Every query, every case, all the way back to the fire at the docks — it was always leading here. Well done, Detective.",
      },
    ],
  },
];
