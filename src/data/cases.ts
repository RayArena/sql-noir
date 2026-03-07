export interface CaseObjective {
  id: string;
  title: string;
  description: string;
  hint: string;
  /** The query result must include these values to pass */
  validationFn: (rows: Record<string, unknown>[]) => boolean;
  successMessage: string;
  narrativeAfter: string;
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
  teaser: string;
  briefing: string;
  schema: CaseSchema;
  objectives: CaseObjective[];
}

export const CASES: GameCase[] = [
  {
    id: 1,
    slug: "the-royal-ruby",
    title: "The Case of the Royal Ruby",
    subtitle: "SELECT · WHERE · IS NULL · LIKE · IN",
    difficulty: "Rookie",
    teaser: "A priceless ruby stolen under cover of a suspicious blackout. Byomkesh Bakshi needs his Archivist.",
    briefing:
      "Calcutta, 1946. The Surya Ruby — crown jewel of the Sovabazar Rajbari — has vanished during a grand soiree. The lights went out, the display case was smashed, and Inspector Das has already clapped an innocent electrician in irons. But Byomkesh Bakshi, the Satyanweshi, is not convinced. He has summoned you — his Archivist — to work the evidence terminal. Seven tables of data, ten queries to run. Find the real thief before dawn breaks over the Hooghly.",
    schema: {
      tables: [
        {
          name: "police_fir_logs",
          columns: [
            { name: "fir_id", type: "INT", key: "PK" },
            { name: "location", type: "VARCHAR(100)" },
            { name: "incident_type", type: "VARCHAR(80)" },
            { name: "reported_time", type: "TIME" },
            { name: "officer_in_charge", type: "VARCHAR(60)" },
          ],
        },
        {
          name: "mansion_guest_list",
          columns: [
            { name: "guest_id", type: "INT", key: "PK" },
            { name: "citizen_id", type: "INT", key: "FK" },
            { name: "arrival_time", type: "TIME" },
            { name: "departure_time", type: "TIME" },
            { name: "invite_status", type: "VARCHAR(20)" },
          ],
          references: [{ column: "citizen_id", refTable: "calcutta_citizens", refColumn: "citizen_id" }],
        },
        {
          name: "calcutta_citizens",
          columns: [
            { name: "citizen_id", type: "INT", key: "PK" },
            { name: "full_name", type: "VARCHAR(100)" },
            { name: "neighborhood", type: "VARCHAR(60)" },
            { name: "shoe_size", type: "INT" },
            { name: "footwear_preference", type: "VARCHAR(40)" },
            { name: "height_cm", type: "INT" },
            { name: "eye_color", type: "VARCHAR(20)" },
          ],
        },
        {
          name: "sweet_shop_orders",
          columns: [
            { name: "order_id", type: "INT", key: "PK" },
            { name: "citizen_id", type: "INT", key: "FK" },
            { name: "item_description", type: "VARCHAR(100)" },
            { name: "order_date", type: "DATE" },
            { name: "shop_neighborhood", type: "VARCHAR(60)" },
          ],
          references: [{ column: "citizen_id", refTable: "calcutta_citizens", refColumn: "citizen_id" }],
        },
        {
          name: "calcutta_tram_logs",
          columns: [
            { name: "route_id", type: "INT", key: "PK" },
            { name: "ticket_prefix", type: "VARCHAR(10)" },
            { name: "destination", type: "VARCHAR(60)" },
            { name: "operating_hours", type: "VARCHAR(20)" },
          ],
        },
        {
          name: "employment_history",
          columns: [
            { name: "record_id", type: "INT", key: "PK" },
            { name: "citizen_id", type: "INT", key: "FK" },
            { name: "company_name", type: "VARCHAR(100)" },
            { name: "job_title", type: "VARCHAR(60)" },
            { name: "start_date", type: "DATE" },
            { name: "end_date", type: "DATE" },
            { name: "termination_reason", type: "VARCHAR(80)" },
          ],
          references: [{ column: "citizen_id", refTable: "calcutta_citizens", refColumn: "citizen_id" }],
        },
        {
          name: "rajbari_staff",
          columns: [
            { name: "staff_id", type: "INT", key: "PK" },
            { name: "full_name", type: "VARCHAR(100)" },
            { name: "role", type: "VARCHAR(60)" },
            { name: "shift_start", type: "TIME" },
            { name: "shift_end", type: "TIME" },
          ],
        },
      ],
    },
    objectives: [
      {
        id: "1-1",
        title: "Phase 1: The Blackout Timeline",
        description:
          "Bakshi needs the exact minute of the blackout. Query police_fir_logs to find the reported_time for the incident at 'Sovabazar Rajbari'.",
        hint: "SELECT reported_time FROM police_fir_logs WHERE location = 'Sovabazar Rajbari'",
        validationFn: (rows) =>
          rows.some((r) => String(r.reported_time ?? r.answer ?? "").includes("20:15")),
        successMessage: "8:15 PM. The gem vanished in the dark.",
        narrativeAfter:
          "Bakshi: \"20:15. Now we have our anchor point. Anyone who left before 8:15 PM is innocent. The thief was inside when the lights died.\"",
      },
      {
        id: "1-2",
        title: "Phase 2: Filtering the Guests",
        description:
          "Pull from mansion_guest_list all guests whose departure_time is AFTER '20:15:00' OR whose departure_time IS NULL. The thief is in this list.",
        hint: "SELECT * FROM mansion_guest_list WHERE departure_time > '20:15:00' OR departure_time IS NULL",
        validationFn: (rows) =>
          rows.length >= 5 && rows.some((r) => r.citizen_id !== undefined),
        successMessage: "Suspects narrowed. The thief was still in the building.",
        narrativeAfter:
          "Bakshi: \"Excellent. Now for the physical evidence — the muddy footprint in the corridor. Size 10. Kolhapuri style.\"",
      },
      {
        id: "1-3",
        title: "Phase 3: The Muddy Print",
        description:
          "The thief left a distinctive muddy footprint. Query calcutta_citizens for all citizens with shoe_size = 10 AND footwear_preference = 'Kolhapuri'.",
        hint: "SELECT citizen_id, full_name FROM calcutta_citizens WHERE shoe_size = 10 AND footwear_preference = 'Kolhapuri'",
        validationFn: (rows) =>
          rows.length >= 10 && rows.some((r) => r.full_name !== undefined || r.citizen_id !== undefined),
        successMessage: "60 citizens with size 10 Kolhapuri chappals.",
        narrativeAfter:
          "Bakshi: \"Sixty men. Better. But still too many. Thankfully the thief was also careless with his snacks — he dropped a crushed Nalen Gur Sandesh.\"",
      },
      {
        id: "1-4",
        title: "Phase 4: The Sweet Tooth",
        description:
          "The thief dropped a Nalen Gur Sandesh. Query sweet_shop_orders using LIKE '%Nalen Gur%' for orders placed on '1946-10-04'.",
        hint: "SELECT citizen_id FROM sweet_shop_orders WHERE item_description LIKE '%Nalen Gur%' AND order_date = '1946-10-04'",
        validationFn: (rows) =>
          rows.length >= 5 && rows.some((r) => r.citizen_id !== undefined),
        successMessage: "15 buyers of Nalen Gur Sandesh that day.",
        narrativeAfter:
          "Bakshi: \"Fifteen people bought this particular sweet today. Now — cross-reference. Find who appears on BOTH lists.\"",
      },
      {
        id: "1-5",
        title: "Phase 5: The Intersection",
        description:
          "Cross-reference: find citizens who BOTH wear size 10 Kolhapuri chappals AND bought Nalen Gur on 1946-10-04. Use a subquery with IN or a JOIN.",
        hint: "SELECT citizen_id, full_name FROM calcutta_citizens WHERE shoe_size = 10 AND footwear_preference = 'Kolhapuri' AND citizen_id IN (SELECT citizen_id FROM sweet_shop_orders WHERE item_description LIKE '%Nalen Gur%' AND order_date = '1946-10-04')",
        validationFn: (rows) =>
          rows.length >= 2 &&
          rows.some((r) =>
            ["amitava bose", "bhavani shankar", "devdas mukherjee"].includes(
              String(r.full_name ?? "").toLowerCase()
            )
          ),
        successMessage: "Three suspects: Amitava Bose, Bhavani Shankar, Devdas Mukherjee.",
        narrativeAfter:
          "Bakshi: \"Three men. He also dropped his tram ticket stub in his haste. The prefix is 'T-89'. Let's find where that tram goes.\"",
      },
      {
        id: "1-6",
        title: "Phase 6: The Torn Ticket",
        description:
          "The thief dropped a tram ticket stub with prefix 'T-89'. Query calcutta_tram_logs to find where this tram goes.",
        hint: "SELECT destination FROM calcutta_tram_logs WHERE ticket_prefix = 'T-89'",
        validationFn: (rows) =>
          rows.some((r) =>
            String(r.destination ?? r.answer ?? "").toLowerCase().includes("shyambazar")
          ),
        successMessage: "Tram T-89 goes to Shyambazar.",
        narrativeAfter:
          "Bakshi: \"Shyambazar. A busy neighborhood — perfect for hiding. Now — which of our three suspects lives there?\"",
      },
      {
        id: "1-7",
        title: "Phase 7: Pinpointing the Target",
        description:
          "Query calcutta_citizens. From our three suspects (citizen_id IN (1017, 1042, 1089)), find who lives in neighborhood = 'Shyambazar'.",
        hint: "SELECT full_name, neighborhood FROM calcutta_citizens WHERE citizen_id IN (1017, 1042, 1089) AND neighborhood = 'Shyambazar'",
        validationFn: (rows) =>
          rows.some((r) =>
            String(r.full_name ?? r.answer ?? "").toLowerCase().includes("bhavani")
          ),
        successMessage: "Bhavani Shankar. He lives in Shyambazar.",
        narrativeAfter:
          "Bakshi: \"Bhavani Shankar. But why steal a raw ruby? He couldn't sell it openly without getting caught — unless he could cut it himself. Check his employment history.\"",
      },
      {
        id: "1-8",
        title: "Phase 8: The Motive",
        description:
          "Query employment_history for citizen_id = 1042. Use ORDER BY end_date DESC LIMIT 1 to get his most recent job and termination reason.",
        hint: "SELECT job_title, termination_reason FROM employment_history WHERE citizen_id = 1042 ORDER BY end_date DESC LIMIT 1",
        validationFn: (rows) =>
          rows.some(
            (r) =>
              String(r.termination_reason ?? r.answer ?? "").toLowerCase().includes("embezzlement") ||
              String(r.job_title ?? "").toLowerCase().includes("gem")
          ),
        successMessage: "Master Gem Cutter — fired for Embezzlement. Motive confirmed.",
        narrativeAfter:
          "Bakshi: \"A gem cutter. He could slice the Surya Ruby into a dozen untraceable stones by dawn. But a gem cutter doesn't know the Rajbari's electrical layout. He needed someone on the inside.\"",
      },
      {
        id: "1-9",
        title: "Phase 9: The Inside Man",
        description:
          "Someone inside unlocked the fuse box. Query rajbari_staff for any staff member whose full_name contains 'Shankar'.",
        hint: "SELECT full_name, role FROM rajbari_staff WHERE full_name LIKE '%Shankar%'",
        validationFn: (rows) =>
          rows.some((r) =>
            String(r.full_name ?? r.answer ?? "").toLowerCase().includes("lata shankar")
          ),
        successMessage: "Lata Shankar — Maid. Bhavani's niece on the inside.",
        narrativeAfter:
          "Bakshi: \"Lata Shankar. His niece, working as a maid in the Rajbari. She unlocked the box, Raju the electrician took the blame, and Bhavani walked out with the ruby. One final query, Archivist — let's close the book.\"",
      },
      {
        id: "1-10",
        title: "Phase 10: The Arrest Warrant",
        description:
          "Write the final query. Pull citizen_id, full_name, and neighborhood from calcutta_citizens for Bhavani Shankar to generate the arrest warrant.",
        hint: "SELECT citizen_id, full_name, neighborhood FROM calcutta_citizens WHERE full_name = 'Bhavani Shankar'",
        validationFn: (rows) =>
          rows.some(
            (r) =>
              String(r.full_name ?? r.answer ?? "").toLowerCase().includes("bhavani shankar") ||
              Number(r.citizen_id) === 1042
          ),
        successMessage: "CASE CLOSED. Warrant issued. The Truth-Seeker wins again.",
        narrativeAfter:
          "The police raided the apartment in Shyambazar minutes later. Bhavani Shankar was found at his workbench, loupe in eye, the Surya Ruby clamped in a vise. Justice is served.",
      },
    ],
  },
  {
    id: 2,
    slug: "the-double-identity",
    title: "The Double Identity",
    subtitle: "JOINs",
    difficulty: "Detective",
    teaser: "A con artist is living under multiple names. Cross-reference records to expose the fraud.",
    briefing:
      "We've got a slippery one. Someone is running an elaborate identity fraud, opening bank accounts under different names. We suspect it's the same person. Your job: cross-reference our citizens with bank records and ID registrations to expose the con artist.",
    schema: {
      tables: [
        {
          name: "persons",
          columns: [
            { name: "id", type: "INTEGER", key: "PK" },
            { name: "full_name", type: "TEXT" },
            { name: "ssn_hash", type: "TEXT" },
            { name: "date_of_birth", type: "DATE" },
            { name: "address", type: "TEXT" },
          ],
        },
        {
          name: "bank_accounts",
          columns: [
            { name: "id", type: "INTEGER", key: "PK" },
            { name: "person_id", type: "INTEGER", key: "FK" },
            { name: "bank_name", type: "TEXT" },
            { name: "account_number", type: "TEXT" },
            { name: "balance", type: "DECIMAL" },
            { name: "opened_at", type: "DATE" },
          ],
          references: [{ column: "person_id", refTable: "persons", refColumn: "id" }],
        },
        {
          name: "id_documents",
          columns: [
            { name: "id", type: "INTEGER", key: "PK" },
            { name: "person_id", type: "INTEGER", key: "FK" },
            { name: "doc_type", type: "TEXT" },
            { name: "doc_number", type: "TEXT" },
            { name: "issued_at", type: "DATE" },
            { name: "is_valid", type: "BOOLEAN" },
          ],
          references: [{ column: "person_id", refTable: "persons", refColumn: "id" }],
        },
      ],
    },
    objectives: [
      {
        id: "2-1",
        title: "List All Accounts",
        description: "Join persons with their bank accounts to see who owns what.",
        hint: "Try: SELECT p.full_name, b.bank_name, b.balance FROM persons p JOIN bank_accounts b ON p.id = b.person_id",
        validationFn: (rows) => rows.length >= 5 && rows.some((r) => r.bank_name !== undefined),
        successMessage: "Now we can see the full picture of account ownership.",
        narrativeAfter: "Something doesn't look right. Multiple people with different names but suspiciously similar details...",
      },
      {
        id: "2-2",
        title: "Find Duplicate SSNs",
        description: "Find persons who share the same SSN hash — they might be the same person.",
        hint: "Try: SELECT p1.full_name, p2.full_name, p1.ssn_hash FROM persons p1 JOIN persons p2 ON p1.ssn_hash = p2.ssn_hash AND p1.id < p2.id",
        validationFn: (rows) => rows.length >= 1 && rows.some((r) => r.ssn_hash !== undefined),
        successMessage: "Gotcha! Same SSN, different names. Classic identity fraud.",
        narrativeAfter: "The names 'Marcus Webb' and 'David Chen' share the same SSN hash. One of these identities is fake — or both are.",
      },
      {
        id: "2-3",
        title: "Check Invalid Documents",
        description: "Use a LEFT JOIN to find persons with invalid or missing ID documents.",
        hint: "Try: SELECT p.full_name, d.doc_type, d.is_valid FROM persons p LEFT JOIN id_documents d ON p.id = d.person_id WHERE d.is_valid = false OR d.id IS NULL",
        validationFn: (rows) => rows.some((r) => r.is_valid === false || r.doc_type === null),
        successMessage: "CASE CLOSED. The con artist has been identified and the accounts frozen.",
        narrativeAfter: "With the forged documents exposed and the duplicate SSN confirmed, Marcus Webb — real name unknown — was arrested at the Eastside branch of First National. All fraudulent accounts have been seized.",
      },
    ],
  },
  {
    id: 3,
    slug: "the-crime-ring",
    title: "The Crime Ring",
    subtitle: "GROUP BY & Aggregation",
    difficulty: "Senior Detective",
    teaser: "A string of connected robberies. Analyze crime data patterns to find the gang's leader.",
    briefing:
      "Detective, the city is being terrorized by a highly organized robbery ring. 12 heists in 3 months, all with the same MO. We've got crime scene data, suspect records, and transaction logs. Crunch the numbers and find us the ringleader.",
    schema: {
      tables: [
        {
          name: "crimes",
          columns: [
            { name: "id", type: "INTEGER", key: "PK" },
            { name: "crime_type", type: "TEXT" },
            { name: "location", type: "TEXT" },
            { name: "date_committed", type: "DATE" },
            { name: "amount_stolen", type: "DECIMAL" },
            { name: "district", type: "TEXT" },
          ],
        },
        {
          name: "suspects",
          columns: [
            { name: "id", type: "INTEGER", key: "PK" },
            { name: "name", type: "TEXT" },
            { name: "alias", type: "TEXT" },
            { name: "rank", type: "TEXT" },
            { name: "arrest_count", type: "INTEGER" },
          ],
        },
        {
          name: "crime_suspects",
          columns: [
            { name: "crime_id", type: "INTEGER", key: "FK" },
            { name: "suspect_id", type: "INTEGER", key: "FK" },
            { name: "role", type: "TEXT" },
          ],
          references: [
            { column: "crime_id", refTable: "crimes", refColumn: "id" },
            { column: "suspect_id", refTable: "suspects", refColumn: "id" },
          ],
        },
      ],
    },
    objectives: [
      {
        id: "3-1",
        title: "Crimes per District",
        description: "Count how many crimes occurred in each district to find the hotspot.",
        hint: "Try: SELECT district, COUNT(*) as crime_count FROM crimes GROUP BY district ORDER BY crime_count DESC",
        validationFn: (rows) => rows.length >= 2 && rows.some((r) => r.crime_count !== undefined || r.count !== undefined),
        successMessage: "The Downtown district is their hunting ground.",
        narrativeAfter: "Downtown has 5 hits — more than double any other area. They're bold, hitting the busiest part of the city.",
      },
      {
        id: "3-2",
        title: "Total Haul Analysis",
        description: "Calculate the total amount stolen by each suspect to find who's getting the biggest cut.",
        hint: "Try: SELECT s.name, SUM(c.amount_stolen) as total FROM suspects s JOIN crime_suspects cs ON s.id = cs.suspect_id JOIN crimes c ON cs.crime_id = c.id GROUP BY s.name ORDER BY total DESC",
        validationFn: (rows) => rows.length >= 2 && rows.some((r) => r.total !== undefined || r.sum !== undefined),
        successMessage: "Follow the money... now we're getting somewhere.",
        narrativeAfter: "One name keeps appearing at the top of every calculation. The money flows uphill in this organization.",
      },
      {
        id: "3-3",
        title: "Find the Ringleader",
        description: "Find suspects involved in more than 3 crimes using HAVING. The one with the most connections is the leader.",
        hint: "Try: SELECT s.name, s.alias, COUNT(cs.crime_id) as jobs FROM suspects s JOIN crime_suspects cs ON s.id = cs.suspect_id GROUP BY s.name, s.alias HAVING COUNT(cs.crime_id) > 3",
        validationFn: (rows) => rows.length >= 1 && rows.some((r) => (r.jobs !== undefined && Number(r.jobs) > 3) || (r.count !== undefined && Number(r.count) > 3)),
        successMessage: "CASE CLOSED. The ringleader is behind bars.",
        narrativeAfter: "Viktor 'The Ghost' Petrov — involved in every single heist, always taking the biggest cut. SWAT raided his penthouse at dawn. The crime ring is broken.",
      },
    ],
  },
  {
    id: 4,
    slug: "the-inside-job",
    title: "The Inside Job",
    subtitle: "Subqueries & Complex Queries",
    difficulty: "Chief Inspector",
    teaser: "A corporate heist with an insider. Unravel the conspiracy using advanced SQL techniques.",
    briefing:
      "This one goes deep, detective. A $50 million art collection vanished from the Meridian Gallery during a gala. Security footage was wiped. The alarm was disabled from inside. We need you to untangle employee records, access logs, and financial trails to find the insider.",
    schema: {
      tables: [
        {
          name: "employees",
          columns: [
            { name: "id", type: "INTEGER", key: "PK" },
            { name: "name", type: "TEXT" },
            { name: "department", type: "TEXT" },
            { name: "role", type: "TEXT" },
            { name: "salary", type: "DECIMAL" },
            { name: "hired_at", type: "DATE" },
            { name: "clearance_level", type: "INTEGER" },
          ],
        },
        {
          name: "access_logs",
          columns: [
            { name: "id", type: "INTEGER", key: "PK" },
            { name: "employee_id", type: "INTEGER", key: "FK" },
            { name: "area", type: "TEXT" },
            { name: "accessed_at", type: "TIMESTAMP" },
            { name: "action", type: "TEXT" },
          ],
          references: [{ column: "employee_id", refTable: "employees", refColumn: "id" }],
        },
        {
          name: "transactions",
          columns: [
            { name: "id", type: "INTEGER", key: "PK" },
            { name: "employee_id", type: "INTEGER", key: "FK" },
            { name: "amount", type: "DECIMAL" },
            { name: "type", type: "TEXT" },
            { name: "date", type: "DATE" },
            { name: "description", type: "TEXT" },
          ],
          references: [{ column: "employee_id", refTable: "employees", refColumn: "id" }],
        },
      ],
    },
    objectives: [
      {
        id: "4-1",
        title: "High Clearance Personnel",
        description: "Find employees with above-average clearance levels — only they could disable the alarm.",
        hint: "Try: SELECT * FROM employees WHERE clearance_level > (SELECT AVG(clearance_level) FROM employees)",
        validationFn: (rows) => rows.length >= 1 && rows.some((r) => r.clearance_level !== undefined),
        successMessage: "Narrowing the suspects... only a few had the access.",
        narrativeAfter: "Only 4 employees had clearance high enough to reach the security panel. One of them is our insider.",
      },
      {
        id: "4-2",
        title: "Suspicious After-Hours Access",
        description: "Find employees who accessed the vault area after hours on the night of the heist.",
        hint: "Try: SELECT e.name, a.area, a.accessed_at FROM employees e JOIN access_logs a ON e.id = a.employee_id WHERE a.area = 'Vault' AND a.accessed_at > '2024-03-15 18:00:00'",
        validationFn: (rows) => rows.length >= 1 && rows.some((r) => String(r.area).toLowerCase().includes("vault")),
        successMessage: "Someone was in the vault when they shouldn't have been...",
        narrativeAfter: "Two people accessed the vault after 6 PM. One was authorized security. The other... was not on the schedule.",
      },
      {
        id: "4-3",
        title: "Follow the Money",
        description: "Find employees who received unusually large deposits (more than their salary) in the month after the heist.",
        hint: "Try: SELECT e.name, t.amount, e.salary FROM employees e JOIN transactions t ON e.id = t.employee_id WHERE t.type = 'deposit' AND t.amount > e.salary AND t.date > '2024-03-15'",
        validationFn: (rows) => rows.length >= 1 && rows.some((r) => Number(r.amount) > Number(r.salary)),
        successMessage: "CASE CLOSED. The insider has been exposed.",
        narrativeAfter: "Rachel Torres, Head of Security. High clearance, vault access after hours, and a $200,000 'consulting fee' deposited two weeks after the heist. She orchestrated everything — disabled the cameras, unlocked the vault, and walked out with $50 million in art. She's now in custody, and the art was recovered from a storage unit in Jersey. Exceptional work, Chief Inspector.",
      },
    ],
  },
];
