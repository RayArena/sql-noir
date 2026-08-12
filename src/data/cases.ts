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
  teaser: string;
  briefing: string;
  schema: CaseSchema;
  objectives: CaseObjective[];
  quests: CaseQuest[];
}

export const CASES: GameCase[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // CASE 1 — THE ROYAL RUBY (Calcutta, 1946)
  // Skills: SELECT, WHERE, AND, OR, LIKE, ORDER BY
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 1,
    slug: "the-royal-ruby",
    title: "The Case of the Royal Ruby",
    subtitle: "SELECT · WHERE · AND · OR · LIKE · ORDER BY",
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
        {
          name: "calcutta_investigation_master_view",
          columns: [
            { name: "citizen_id", type: "INT" },
            { name: "full_name", type: "VARCHAR(100)" },
            { name: "neighborhood", type: "VARCHAR(60)" },
            { name: "shoe_size", type: "INT" },
            { name: "footwear_preference", type: "VARCHAR(40)" },
            { name: "arrival_time", type: "TIME" },
            { name: "departure_time", type: "TIME" },
            { name: "item_description", type: "VARCHAR(100)" },
            { name: "order_date", type: "DATE" },
            { name: "job_title", type: "VARCHAR(60)" },
            { name: "termination_reason", type: "VARCHAR(80)" },
          ],
        },
      ],
    },
    objectives: [
      {
        id: "1-1", questId: "1-q1",
        title: "Phase 1: The Blackout Timeline",
        description: "Bakshi needs the exact minute of the blackout. Query police_fir_logs to find the reported_time for the incident at 'Sovabazar Rajbari'.",
        hint: "submit(SELECT reported_time FROM police_fir_logs WHERE location = 'Sovabazar Rajbari')",
        validationFn: (rows) => rows.some((r) => String(r.reported_time ?? r.answer ?? "").includes("20:15")),
        successMessage: "8:15 PM. The gem vanished in the dark.",
        narrativeAfter: "Bakshi: \"20:15. Now we have our anchor point. Anyone who left before 8:15 PM is innocent. The thief was inside when the lights died.\"",
      },
      {
        id: "1-2", questId: "1-q1",
        title: "Phase 2: Filtering the Guests",
        description: "Pull from mansion_guest_list everyone whose departure_time is after '20:15:00' OR equals '00:00:00'. Note: '00:00:00' is the staff code for a departure that was never recorded.",
        hint: "submit(SELECT * FROM mansion_guest_list WHERE departure_time > '20:15:00' OR departure_time = '00:00:00')",
        validationFn: (rows) => rows.length >= 5 && rows.some((r) => r.citizen_id !== undefined),
        successMessage: "Suspects narrowed. The thief was still in the building.",
        narrativeAfter: "Bakshi: \"Excellent. Now for the physical evidence — the muddy footprint in the corridor. Size 10. Kolhapuri style.\"",
      },
      {
        id: "1-3", questId: "1-q1",
        title: "Phase 3: The Muddy Print",
        description: "The thief left a distinctive muddy footprint. Query calcutta_citizens for all citizens with shoe_size = 10 AND footwear_preference = 'Kolhapuri'.",
        hint: "submit(SELECT citizen_id, full_name FROM calcutta_citizens WHERE shoe_size = 10 AND footwear_preference = 'Kolhapuri')",
        validationFn: (rows) => rows.length >= 10 && rows.some((r) => r.full_name !== undefined),
        successMessage: "60 citizens with size 10 Kolhapuri chappals.",
        narrativeAfter: "Bakshi: \"Sixty men. But still too many. The thief was also careless with his snacks — he dropped a crushed Nalen Gur Sandesh.\"",
      },
      {
        id: "1-4", questId: "1-q2",
        title: "Phase 4: The Sweet Tooth",
        description: "The thief dropped a Nalen Gur Sandesh. Query sweet_shop_orders using LIKE '%Nalen Gur%' for orders placed on '1946-10-04'.",
        hint: "submit(SELECT citizen_id FROM sweet_shop_orders WHERE item_description LIKE '%Nalen Gur%' AND order_date = '1946-10-04')",
        validationFn: (rows) => rows.length >= 5 && rows.some((r) => r.citizen_id !== undefined),
        successMessage: "15 buyers of Nalen Gur Sandesh that day.",
        narrativeAfter: "Bakshi: \"Fifteen people bought this particular sweet today. Now — cross-reference. Find who appears on BOTH lists.\"",
      },
      {
        id: "1-5", questId: "1-q2",
        title: "Phase 5: The Intersection",
        description: "Cross-reference all four conditions using the calcutta_investigation_master_view. Filter by shoe_size, footwear_preference, item_description LIKE, and order_date using AND.",
        hint: "submit(SELECT full_name FROM calcutta_investigation_master_view WHERE shoe_size = 10 AND footwear_preference = 'Kolhapuri' AND item_description LIKE '%Nalen Gur%' AND order_date = '1946-10-04')",
        validationFn: (rows) =>
          rows.length >= 2 &&
          rows.some((r) =>
            ["amitava bose", "bhavani shankar", "devdas mukherjee"].includes(String(r.full_name ?? "").toLowerCase())
          ),
        successMessage: "Three suspects: Amitava Bose, Bhavani Shankar, Devdas Mukherjee.",
        narrativeAfter: "Bakshi: \"Three men. He also dropped his tram ticket stub. The prefix is 'T-89'. Let's find where that tram goes.\"",
      },
      {
        id: "1-6", questId: "1-q2",
        title: "Phase 6: The Torn Ticket",
        description: "The thief dropped a tram ticket stub with prefix 'T-89'. Query calcutta_tram_logs to find where this tram goes.",
        hint: "submit(SELECT destination FROM calcutta_tram_logs WHERE ticket_prefix = 'T-89')",
        validationFn: (rows) =>
          rows.some((r) => String(r.destination ?? r.answer ?? "").toLowerCase().includes("shyambazar")),
        successMessage: "Tram T-89 goes to Shyambazar.",
        narrativeAfter: "Bakshi: \"Shyambazar. Which of our three suspects lives there?\"",
      },
      {
        id: "1-7", questId: "1-q3",
        title: "Phase 7: Pinpointing the Target",
        description: "Query calcutta_citizens for all three suspects using OR, then AND with neighborhood = 'Shyambazar'. Mind your brackets.",
        hint: "submit(SELECT full_name, neighborhood FROM calcutta_citizens WHERE (full_name = 'Amitava Bose' OR full_name = 'Bhavani Shankar' OR full_name = 'Devdas Mukherjee') AND neighborhood = 'Shyambazar')",
        validationFn: (rows) =>
          rows.some((r) => String(r.full_name ?? r.answer ?? "").toLowerCase().includes("bhavani")),
        successMessage: "Bhavani Shankar. He lives in Shyambazar.",
        narrativeAfter: "Bakshi: \"Bhavani Shankar. But why steal a raw ruby? He needs to cut it. Check his employment history.\"",
      },
      {
        id: "1-8", questId: "1-q3",
        title: "Phase 8: The Motive",
        description: "Query employment_history for citizen_id = 1042. Sort by end_date DESC — most recent job at the top.",
        hint: "submit(SELECT job_title, termination_reason FROM employment_history WHERE citizen_id = 1042 ORDER BY end_date DESC)",
        validationFn: (rows) =>
          rows.some((r) =>
            String(r.termination_reason ?? r.answer ?? "").toLowerCase().includes("embezzlement") ||
            String(r.job_title ?? "").toLowerCase().includes("gem")
          ),
        successMessage: "Master Gem Cutter — fired for Embezzlement. Motive confirmed.",
        narrativeAfter: "Bakshi: \"A gem cutter. He needed someone on the inside for the fuse box. Who on the staff shares his surname?\"",
      },
      {
        id: "1-9", questId: "1-q3",
        title: "Phase 9: The Inside Man",
        description: "Someone inside unlocked the fuse box. Query rajbari_staff for any staff member whose full_name contains 'Shankar'.",
        hint: "submit(SELECT full_name, role FROM rajbari_staff WHERE full_name LIKE '%Shankar%')",
        validationFn: (rows) =>
          rows.some((r) => String(r.full_name ?? r.answer ?? "").toLowerCase().includes("lata shankar")),
        successMessage: "Lata Shankar — Maid. Bhavani's niece on the inside.",
        narrativeAfter: "Bakshi: \"Lata Shankar. His niece. One final query, Archivist — let's close the book.\"",
      },
      {
        id: "1-10", questId: "1-q3",
        title: "Phase 10: The Arrest Warrant",
        description: "Write the final query. Pull citizen_id, full_name, and neighborhood from calcutta_citizens for Bhavani Shankar to generate the arrest warrant.",
        hint: "submit(SELECT citizen_id, full_name, neighborhood FROM calcutta_citizens WHERE full_name = 'Bhavani Shankar')",
        validationFn: (rows) =>
          rows.some((r) =>
            String(r.full_name ?? r.answer ?? "").toLowerCase().includes("bhavani shankar") ||
            Number(r.citizen_id) === 1042
          ),
        successMessage: "CASE CLOSED. Warrant issued. The Truth-Seeker wins again.",
        narrativeAfter: "The police raided the apartment in Shyambazar minutes later. Bhavani Shankar was found at his workbench, the Surya Ruby clamped in a vise. Justice is served.",
      },
    ],
    quests: [
      { id: "1-q1", title: "The Night of the Blackout", description: "Establish the crime timeline and identify suspects who were present when the lights went out.", objectiveIds: ["1-1", "1-2", "1-3"] },
      { id: "1-q2", title: "Trail of the Sweet Tooth", description: "Follow the clues left by the thief — a crushed sweet and a torn tram ticket — to narrow down the suspect.", objectiveIds: ["1-4", "1-5", "1-6"] },
      { id: "1-q3", title: "The Gem Cutter's Secret", description: "Uncover the motive, the inside accomplice, and generate the final arrest warrant.", objectiveIds: ["1-7", "1-8", "1-9", "1-10"] },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CASE 2 — THE PHANTOM WITNESS (Mumbai, 2003)
  // 12 phases · 3 quests
  // Skills: JOIN, date filtering, GROUP BY, LIKE, correlated lookups
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 2,
    slug: "the-phantom-witness",
    title: "The Phantom Witness",
    subtitle: "JOIN · Date Filtering · GROUP BY · LIKE · Correlated Lookups",
    difficulty: "Detective",
    teaser: "A journalist murdered in a Mumbai 5-star hotel. 80 guests, one killer — find who accessed Room 401.",
    briefing:
      "Mumbai, November 2003. Rajan Mehta, investigative journalist, was found dead in Room 401 of the Oberoi Grand during a high-profile political summit. Security footage for the 4th floor was wiped between 23:30 and 02:30. The hotel logs, phone records, and minibar charges are intact. You have 80 registered guests, a guest-room access log, phone logs, journalist contacts, and minibar records. The killer entered Room 401 after midnight. Find them.",
    schema: {
      tables: [
        {
          name: "hotel_guests",
          columns: [
            { name: "guest_id", type: "INT", key: "PK" },
            { name: "full_name", type: "TEXT" },
            { name: "nationality", type: "TEXT" },
            { name: "check_in", type: "DATETIME" },
            { name: "check_out", type: "DATETIME" },
            { name: "room_number", type: "INT" },
            { name: "vip_status", type: "INT" },
            { name: "purpose_of_visit", type: "TEXT" },
            { name: "booked_by", type: "TEXT" },
          ],
        },
        {
          name: "room_access_logs",
          columns: [
            { name: "log_id", type: "INT", key: "PK" },
            { name: "guest_id", type: "INT", key: "FK" },
            { name: "room_number", type: "INT" },
            { name: "accessed_room", type: "INT" },
            { name: "access_time", type: "DATETIME" },
            { name: "access_type", type: "TEXT" },
          ],
          references: [{ column: "guest_id", refTable: "hotel_guests", refColumn: "guest_id" }],
        },
        {
          name: "hotel_phone_logs",
          columns: [
            { name: "call_id", type: "INT", key: "PK" },
            { name: "caller_room", type: "INT" },
            { name: "callee_room", type: "INT" },
            { name: "call_time", type: "DATETIME" },
            { name: "duration_seconds", type: "INT" },
            { name: "call_type", type: "TEXT" },
          ],
        },
        {
          name: "journalist_contacts",
          columns: [
            { name: "contact_id", type: "INT", key: "PK" },
            { name: "journalist_name", type: "TEXT" },
            { name: "contact_type", type: "TEXT" },
            { name: "contact_name", type: "TEXT" },
            { name: "known_conflict", type: "TEXT" },
          ],
        },
        {
          name: "minibar_charges",
          columns: [
            { name: "charge_id", type: "INT", key: "PK" },
            { name: "room_number", type: "INT" },
            { name: "item", type: "TEXT" },
            { name: "charge_time", type: "DATETIME" },
            { name: "amount", type: "REAL" },
          ],
        },
        {
          name: "staff_master",
          columns: [
            { name: "staff_id", type: "INT", key: "PK" },
            { name: "full_name", type: "TEXT" },
            { name: "department", type: "TEXT" },
            { name: "shift", type: "TEXT" },
            { name: "has_master_key", type: "INT" },
          ],
        },
      ],
    },
    objectives: [
      // ── Quest 1: Arrival at the Oberoi ─────────────────────────────────────
      {
        id: "2-1", questId: "2-q1",
        title: "Phase 1: Survey the Summit Guests",
        description:
          "Before we narrow suspects, understand the scale. Query hotel_guests to find all guests attending for 'Conference' or 'Diplomatic' purposes. Use IN(...) or OR. How many delegates were at the summit?",
        hint: "submit(SELECT full_name, nationality, room_number, purpose_of_visit FROM hotel_guests WHERE purpose_of_visit IN ('Conference', 'Diplomatic') ORDER BY nationality)",
        validationFn: (rows) =>
          rows.length >= 10 && rows.some((r) => r.purpose_of_visit !== undefined),
        successMessage: "Confirmed: dozens of summit delegates registered across both wings.",
        narrativeAfter:
          "Over thirty delegates from twelve nations. Among them — diplomats with immunity and business guests with leverage. The murder happened inside this crowd. Keep scanning.",
      },
      {
        id: "2-2", questId: "2-q1",
        title: "Phase 2: Identify the VIP Floor Guests",
        description:
          "VIP guests (vip_status = 1) were placed on the protected 7th floor — BUT they had access to all floors via diplomatic credentials. Find the VIP guest list. These are people who can move freely.",
        hint: "submit(SELECT guest_id, full_name, nationality, room_number, purpose_of_visit FROM hotel_guests WHERE vip_status = 1)",
        validationFn: (rows) =>
          rows.length >= 3 && rows.some((r) => Number(r.vip_status) === 1),
        successMessage: "5 VIP guests with unrestricted floor access.",
        narrativeAfter:
          "Five VIP guests with diplomatic cover. Any of them could move between floors without triggering normal key-card alerts. Noted. Now focus on Room 401 — the crime scene.",
      },
      {
        id: "2-3", questId: "2-q1",
        title: "Phase 3: Room 401 Intrusions After Midnight",
        description:
          "The killer entered Room 401 (victim's room) after midnight. Query room_access_logs to find all entries where accessed_room = 401 AND access_time is after '2003-11-15 00:00'. Submit the full log.",
        hint: "submit(SELECT * FROM room_access_logs WHERE accessed_room = 401 AND access_time > '2003-11-15 00:00')",
        validationFn: (rows) =>
          rows.length >= 2 &&
          rows.some((r) => String(r.access_time ?? "").includes("2003-11-15")) &&
          rows.some((r) => Number(r.accessed_room) === 401),
        successMessage: "Three unauthorised access events to Room 401 after midnight.",
        narrativeAfter:
          "Three guests entered Room 401 after midnight using different key types. Guest IDs: 1010, 1034, and 1068. Now find out what each of those guests was doing — and which room they each came from.",
      },
      {
        id: "2-4", questId: "2-q1",
        title: "Phase 4: Map the Suspect Rooms",
        description:
          "JOIN hotel_guests with room_access_logs on guest_id. Filter for guests who accessed Room 401 after midnight. You need their names, nationalities, and own room numbers. Submit the result.",
        hint: "submit(SELECT hg.full_name, hg.nationality, hg.room_number, ral.access_time, ral.access_type FROM hotel_guests hg JOIN room_access_logs ral ON hg.guest_id = ral.guest_id WHERE ral.accessed_room = 401 AND ral.access_time > '2003-11-15 00:00')",
        validationFn: (rows) =>
          rows.length >= 2 &&
          rows.some((r) => r.full_name !== undefined && r.room_number !== undefined) &&
          rows.some((r) => String(r.full_name ?? "").toLowerCase().includes("morozov") ||
            Number(r.room_number) === 510 || Number(r.room_number) === 209 || Number(r.room_number) === 214),
        successMessage: "Three intruders identified: Morozov (510), Sobol (209), Petrov (214).",
        narrativeAfter:
          "Viktor Morozov, Mikhail Sobol, and Vanya Petrov — all Russian nationals, all at the summit for 'Business'. Three guests who entered a journalist's room after midnight. One of them is the killer.",
      },

      // ── Quest 2: Tracing the Killer ────────────────────────────────────────
      {
        id: "2-5", questId: "2-q2",
        title: "Phase 5: Phone Calls to Room 401",
        description:
          "Before the murder, rooms called Room 401. JOIN hotel_guests with hotel_phone_logs on room_number = caller_room WHERE callee_room = 401. Find who called the victim — and how many times. ORDER BY call_time.",
        hint: "submit(SELECT hg.full_name, hg.room_number, hpl.call_time, hpl.duration_seconds FROM hotel_guests hg JOIN hotel_phone_logs hpl ON hg.room_number = hpl.caller_room WHERE hpl.callee_room = 401 ORDER BY hpl.call_time)",
        validationFn: (rows) =>
          rows.length >= 3 &&
          rows.some((r) =>
            String(r.full_name ?? "").toLowerCase().includes("morozov") || Number(r.room_number) === 510
          ),
        successMessage: "Room 510 (Morozov) called Room 401 twice — then placed an external call.",
        narrativeAfter:
          "Viktor Morozov from Room 510 called Room 401 at 22:15 and again at 23:10. Then at 23:55 he made a 3-minute external call — to an unknown number. Minutes later he entered Room 401.",
      },
      {
        id: "2-6", questId: "2-q2",
        title: "Phase 6: External Calls During the Murder Window",
        description:
          "Someone made an external call (callee_room = 0) between 23:30 and 02:30 — the exact window the footage was wiped. Find all external calls in that window. These connect the killer to an outside contact.",
        hint: "submit(SELECT caller_room, call_time, duration_seconds FROM hotel_phone_logs WHERE call_type = 'External' AND call_time > '2003-11-14 23:30' AND call_time < '2003-11-15 02:30' ORDER BY call_time)",
        validationFn: (rows) =>
          rows.length >= 1 &&
          rows.some((r) => String(r.call_type ?? "").toLowerCase().includes("external") ||
            Number(r.callee_room) === 0),
        successMessage: "One external call: Room 510 at 23:55 for 3 minutes.",
        narrativeAfter:
          "Room 510. Morozov called an external number for 3 minutes at 23:55. That was the signal. Fourteen minutes later he entered Room 401. Now check what he ordered — a nervous man drinks.",
      },
      {
        id: "2-7", questId: "2-q2",
        title: "Phase 7: Morozov's Minibar — The Nerves",
        description:
          "Check what Room 510 (Morozov) ordered from the minibar. A nervous guest orders more than usual. Query minibar_charges WHERE room_number = 510, ORDER BY charge_time.",
        hint: "submit(SELECT item, charge_time, amount FROM minibar_charges WHERE room_number = 510 ORDER BY charge_time)",
        validationFn: (rows) =>
          rows.length >= 2 && rows.some((r) => Number(r.room_number ?? 510) === 510 || r.item !== undefined),
        successMessage: "Whisky, Soda, Peanuts — and Champagne ordered AFTER midnight.",
        narrativeAfter:
          "Morozov ordered whisky and soda at 21:30. Peanuts at 23:00. And then — champagne at 00:30. After the murder. That champagne order at 00:30 is his attempted alibi: 'I was in my room celebrating.' But the access log says otherwise.",
      },
      {
        id: "2-8", questId: "2-q2",
        title: "Phase 8: The Night Staff with Master Keys",
        description:
          "One possibility: Morozov had help from a staff member with a master key. Query staff_master for all Night shift staff who have has_master_key = 1. This tells us who could've assisted.",
        hint: "submit(SELECT full_name, department FROM staff_master WHERE shift = 'Night' AND has_master_key = 1)",
        validationFn: (rows) =>
          rows.length >= 1 && rows.some((r) => Number(r.has_master_key ?? 1) === 1),
        successMessage: "4 night staff with master keys — but no access logs show them near Room 401.",
        narrativeAfter:
          "Four night-shift staff have master keys. None of them appear in the Room 401 access log. Morozov acted alone — he used his own key card entry, borrowed during an afternoon meeting with hotel management. The journalist conflict is next.",
      },

      // ── Quest 3: Locking the Case ──────────────────────────────────────────
      {
        id: "2-9", questId: "2-q3",
        title: "Phase 9: The Documented Conflict",
        description:
          "Query journalist_contacts to find Viktor Morozov's relationship with Rajan Mehta. Filter WHERE contact_name = 'Viktor Morozov'. Submit the full conflict record.",
        hint: "submit(SELECT * FROM journalist_contacts WHERE contact_name = 'Viktor Morozov')",
        validationFn: (rows) =>
          rows.length >= 1 &&
          rows.some((r) =>
            String(r.known_conflict ?? "").toLowerCase().includes("sue") ||
            String(r.contact_name ?? "").toLowerCase().includes("morozov")
          ),
        successMessage: "Morozov threatened to sue over a 2002 exposé that cost him ₹800 crore.",
        narrativeAfter:
          "In 2002, Rajan Mehta published an exposé linking Morozov's energy conglomerate to money laundering through Mumbai shell companies. Morozov lost a ₹800 crore contract. He threatened legal action — and was denied. The motive is iron-clad.",
      },
      {
        id: "2-10", questId: "2-q3",
        title: "Phase 10: Full Access History of Morozov",
        description:
          "Build the complete picture: find ALL room accesses made by guest_id = 1010 (Morozov), across all rooms. ORDER BY access_time. This shows his movements throughout the night.",
        hint: "submit(SELECT accessed_room, access_time, access_type FROM room_access_logs WHERE guest_id = 1010 ORDER BY access_time)",
        validationFn: (rows) =>
          rows.length >= 1 && rows.some((r) => Number(r.guest_id ?? 1010) === 1010 ||
            Number(r.accessed_room) === 401 || r.access_time !== undefined),
        successMessage: "Morozov's full night mapped. Room 401 entry at 01:12, exit at 01:47.",
        narrativeAfter:
          "His own room at 00:00. Room 401 entry at 01:12. Room 401 exit at 01:47. Then back to his room. He was inside Room 401 for exactly 35 minutes. The medical examiner places the time of death between 01:15 and 01:45. This is the smoking gun.",
      },
      {
        id: "2-11", questId: "2-q3",
        title: "Phase 11: The False Alibi — The Champagne",
        description:
          "Morozov's lawyer will argue: 'He was in Room 510 celebrating at 00:30 when champagne was delivered.' Prove it's a fabricated alibi. Check minibar_charges for Room 510, item LIKE '%Champagne%'. Then compare to his room_access_logs timeline.",
        hint: "submit(SELECT item, charge_time FROM minibar_charges WHERE room_number = 510 AND item LIKE '%Champagne%')",
        validationFn: (rows) =>
          rows.length >= 1 && rows.some((r) => String(r.item ?? "").toLowerCase().includes("champagne")),
        successMessage: "Champagne ordered at 00:30 — 78 minutes AFTER the murder window begins.",
        narrativeAfter:
          "The champagne was ordered at 00:30. But Morozov entered Room 401 at 01:12. That means: order champagne at 00:30 (to establish 'I was celebrating in my room'), wait for delivery confirmation, THEN go commit the murder. The alibi is pre-meditated.",
      },
      {
        id: "2-12", questId: "2-q3",
        title: "Phase 12: The Arrest — Full Guest Profile",
        description:
          "Submit the complete profile of Viktor Morozov from hotel_guests. This constitutes the formal arrest record: name, nationality, room, check-in/out, and booking details.",
        hint: "submit(SELECT * FROM hotel_guests WHERE guest_id = 1010)",
        validationFn: (rows) =>
          rows.length >= 1 &&
          rows.some((r) =>
            String(r.full_name ?? "").toLowerCase().includes("morozov") ||
            Number(r.guest_id) === 1010
          ),
        successMessage: "CASE CLOSED. Viktor Morozov arrested at Mumbai airport.",
        narrativeAfter:
          "Viktor Morozov, Russian national, Room 510, booked via Company — arrested at Terminal 2, Chhatrapati Shivaji International Airport, boarding a private jet to Zurich. He never reached the gate. Rajan Mehta's story finally gets published — posthumously.",
      },
    ],
    quests: [
      {
        id: "2-q1",
        title: "Arrival at the Oberoi",
        description: "Survey the summit guests, map the VIP floor, and identify who physically entered Room 401 after midnight.",
        objectiveIds: ["2-1", "2-2", "2-3", "2-4"],
      },
      {
        id: "2-q2",
        title: "Tracing the Killer",
        description: "Follow the phone calls, external contacts, minibar orders, and staff records to zero in on the perpetrator.",
        objectiveIds: ["2-5", "2-6", "2-7", "2-8"],
      },
      {
        id: "2-q3",
        title: "Locking the Case",
        description: "Confirm the motive, reconstruct the night's timeline, expose the false alibi, and issue the arrest record.",
        objectiveIds: ["2-9", "2-10", "2-11", "2-12"],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CASE 3 — THE DIGITAL HEIST (Bangalore, 2019)
  // 12 phases · 3 quests
  // Skills: JOIN, GROUP BY, HAVING, SUM/COUNT, subqueries, NOT LIKE
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 3,
    slug: "the-digital-heist",
    title: "The Digital Heist",
    subtitle: "GROUP BY · HAVING · Aggregates · Subqueries · Multi-table JOIN",
    difficulty: "Senior Detective",
    teaser: "₹50 crore vanished from a Bangalore fintech firm in 4 minutes. An insider covered their tracks — you must uncover them.",
    briefing:
      "Bangalore, September 12, 2019. At 02:25 AM, six wire transfers totalling ₹50.5 million drained four corporate accounts at NovaPay Technologies. Transaction logging was disabled at 02:13 and re-enabled at 04:00. By 09:00 AM the money was in six shell accounts across three continents. IT security found anomalous system_access_logs from the night. You have 40 employees, their access logs, badge permissions, and — crucially — the salary deposits from two weeks later. Find the insider.",
    schema: {
      tables: [
        {
          name: "employees",
          columns: [
            { name: "emp_id", type: "INT", key: "PK" },
            { name: "full_name", type: "TEXT" },
            { name: "department", type: "TEXT" },
            { name: "role", type: "TEXT" },
            { name: "salary", type: "REAL" },
            { name: "join_date", type: "DATE" },
            { name: "clearance_level", type: "INT" },
            { name: "manager_id", type: "INT" },
          ],
        },
        {
          name: "system_access_logs",
          columns: [
            { name: "log_id", type: "INT", key: "PK" },
            { name: "emp_id", type: "INT", key: "FK" },
            { name: "system_name", type: "TEXT" },
            { name: "access_time", type: "DATETIME" },
            { name: "action", type: "TEXT" },
            { name: "ip_address", type: "TEXT" },
            { name: "status", type: "TEXT" },
          ],
          references: [{ column: "emp_id", refTable: "employees", refColumn: "emp_id" }],
        },
        {
          name: "financial_transactions",
          columns: [
            { name: "txn_id", type: "TEXT", key: "PK" },
            { name: "from_account", type: "TEXT" },
            { name: "to_account", type: "TEXT" },
            { name: "amount", type: "REAL" },
            { name: "txn_time", type: "DATETIME" },
            { name: "txn_type", type: "TEXT" },
            { name: "approved_by", type: "INT", key: "FK" },
            { name: "flagged", type: "INT" },
          ],
          references: [{ column: "approved_by", refTable: "employees", refColumn: "emp_id" }],
        },
        {
          name: "employee_badges",
          columns: [
            { name: "badge_id", type: "INT", key: "PK" },
            { name: "emp_id", type: "INT", key: "FK" },
            { name: "badge_type", type: "TEXT" },
            { name: "issued_date", type: "DATE" },
            { name: "can_access_server_room", type: "INT" },
            { name: "can_access_core_db", type: "INT" },
            { name: "can_access_exec_floor", type: "INT" },
          ],
          references: [{ column: "emp_id", refTable: "employees", refColumn: "emp_id" }],
        },
        {
          name: "salary_deposits",
          columns: [
            { name: "deposit_id", type: "INT", key: "PK" },
            { name: "emp_id", type: "INT", key: "FK" },
            { name: "amount", type: "REAL" },
            { name: "deposit_date", type: "DATE" },
            { name: "account_bank", type: "TEXT" },
          ],
          references: [{ column: "emp_id", refTable: "employees", refColumn: "emp_id" }],
        },
      ],
    },
    objectives: [
      // ── Quest 1: Inside NovaPay ────────────────────────────────────────────
      {
        id: "3-1", questId: "3-q1",
        title: "Phase 1: Map the Database Team",
        description:
          "Start by understanding who has access. Query employees to find all Database department staff. Include emp_id, full_name, role, clearance_level. ORDER BY clearance_level DESC.",
        hint: "submit(SELECT emp_id, full_name, role, clearance_level FROM employees WHERE department = 'Database' ORDER BY clearance_level DESC)",
        validationFn: (rows) =>
          rows.length >= 4 && rows.some((r) => String(r.department ?? r.role ?? "").toLowerCase().includes("dba") ||
            Number(r.clearance_level ?? 0) >= 4),
        successMessage: "7 Database team members — three with clearance level 5.",
        narrativeAfter:
          "Seven employees in the Database department. Three of them hold clearance_level 5 — the maximum. Only they could run unrestricted commands on CORE_BANKING_DB without an additional approval chain. Remember their emp_ids.",
      },
      {
        id: "3-2", questId: "3-q1",
        title: "Phase 2: Badge Access to Core DB",
        description:
          "Badge permissions determine who can physically and logically reach the core banking system. Query employee_badges to find all employees where can_access_core_db = 1. JOIN with employees to get their names and roles.",
        hint: "submit(SELECT e.emp_id, e.full_name, e.department, e.role FROM employees e JOIN employee_badges eb ON e.emp_id = eb.emp_id WHERE eb.can_access_core_db = 1 ORDER BY e.department)",
        validationFn: (rows) =>
          rows.length >= 5 && rows.some((r) => String(r.department ?? "").toLowerCase().includes("database") ||
            String(r.role ?? "").toLowerCase().includes("dba")),
        successMessage: "9 employees with direct CORE_BANKING_DB badge clearance.",
        narrativeAfter:
          "Nine people hold the badge clearance. But badge clearance alone doesn't make someone a suspect — they also need to have been active at 02:00 AM. Check the system logs next.",
      },
      {
        id: "3-3", questId: "3-q1",
        title: "Phase 3: The CORE_BANKING_DB Actions — Night of the Heist",
        description:
          "Pull ALL actions taken on 'CORE_BANKING_DB' on the night of the heist (access_time LIKE '2019-09-12%'). Submit results ordered by access_time. Look for the pattern: DISABLE → EXPORT → DELETE.",
        hint: "submit(SELECT emp_id, action, access_time, ip_address, status FROM system_access_logs WHERE system_name = 'CORE_BANKING_DB' AND access_time LIKE '2019-09-12%' ORDER BY access_time)",
        validationFn: (rows) =>
          rows.length >= 8 &&
          rows.some((r) => String(r.action ?? "").includes("EXPORT")) &&
          rows.some((r) => String(r.action ?? "").includes("DISABLE")),
        successMessage: "The sequence confirmed: DISABLE LOGGING → EXPORT → DELETE AUDIT.",
        narrativeAfter:
          "At 02:13 emp_id 10 disabled transaction logging. Between 02:14 and 02:22 multiple employees ran EXPORT commands and one attempted to DELETE audit_log entries. The delete FAILED — they panicked. That failure is what preserved our evidence.",
      },
      {
        id: "3-4", questId: "3-q1",
        title: "Phase 4: The External IP — The Tor Exit Node",
        description:
          "One login to CORE_BANKING_DB came from an IP address NOT starting with '10.' (internal network). This external IP is a Tor exit node — the hacker used it to remotely log in during the heist. Find it.",
        hint: "submit(SELECT emp_id, system_name, access_time, ip_address, action FROM system_access_logs WHERE ip_address NOT LIKE '10.%' AND status = 'SUCCESS')",
        validationFn: (rows) =>
          rows.length >= 1 &&
          rows.some((r) => !String(r.ip_address ?? "10.").startsWith("10.") ||
            String(r.ip_address ?? "").includes("185.")),
        successMessage: "Login from 185.220.101.45 — confirmed Tor exit node. emp_id 19.",
        narrativeAfter:
          "emp_id 19 (Vidya Murthy, DBA) logged in from 185.220.101.45 at 03:01 — a known Tor exit node used by hackers to mask their origin. She was controlling the operation remotely even after physically leaving the office.",
      },

      // ── Quest 2: The Heist Sequence ────────────────────────────────────────
      {
        id: "3-5", questId: "3-q2",
        title: "Phase 5: Who Approved the Fraudulent Transfers?",
        description:
          "The financial_transactions table has a 'flagged' column. JOIN financial_transactions with employees to find the full_name, role, and amount for every flagged transaction. Who signed off on the theft?",
        hint: "submit(SELECT e.full_name, e.role, ft.amount, ft.txn_id, ft.txn_time FROM financial_transactions ft JOIN employees e ON ft.approved_by = e.emp_id WHERE ft.flagged = 1 ORDER BY ft.txn_time)",
        validationFn: (rows) =>
          rows.length >= 3 &&
          rows.some((r) =>
            String(r.full_name ?? "").toLowerCase().includes("arun kumar") ||
            String(r.role ?? "").toLowerCase().includes("dba")
          ),
        successMessage: "Three insiders approved the transfers: Arun Kumar, Vidya Murthy, Archana Shetty.",
        narrativeAfter:
          "emp_ids 10, 19, and 36 split the six wire transfers between them — each approving two. They deliberately distributed the approvals to avoid triggering the single-approver fraud alert. Coordination at this level requires a ringleader.",
      },
      {
        id: "3-6", questId: "3-q2",
        title: "Phase 6: Total Stolen — Aggregate the Damage",
        description:
          "Use SQL aggregation. Query financial_transactions WHERE flagged = 1 to find: the SUM of all stolen amounts AND the COUNT of fraudulent transfers. This is the total damage report.",
        hint: "submit(SELECT COUNT(txn_id) as num_transfers, SUM(amount) as total_stolen FROM financial_transactions WHERE flagged = 1)",
        validationFn: (rows) =>
          rows.length >= 1 &&
          rows.some((r) => Number(r.total_stolen ?? r.num_transfers ?? 0) > 1000000),
        successMessage: "6 transfers totalling ₹44,500,000. The largest insider heist in Indian fintech history.",
        narrativeAfter:
          "Six transfers. Forty-four and a half million rupees. All approved in a four-minute window between 02:25 and 02:30. The precision of it confirms a single orchestrating mind. Now follow the money.",
      },
      {
        id: "3-7", questId: "3-q2",
        title: "Phase 7: The Unusual Salary Deposits",
        description:
          "Two weeks after the heist, four unusual bank deposits appeared. JOIN salary_deposits with employees to find records where the deposit amount is GREATER than the employee's annual salary AND deposit_date > '2019-09-13'. These are the payoffs.",
        hint: "submit(SELECT e.full_name, e.salary, sd.amount, sd.deposit_date, sd.account_bank FROM employees e JOIN salary_deposits sd ON e.emp_id = sd.emp_id WHERE sd.amount > e.salary AND sd.deposit_date > '2019-09-13')",
        validationFn: (rows) =>
          rows.length >= 2 &&
          rows.some((r) => Number(r.amount ?? 0) > 1000000) &&
          rows.some((r) =>
            String(r.account_bank ?? "").toLowerCase().includes("hsbc") ||
            String(r.account_bank ?? "").toLowerCase().includes("dbs") ||
            String(r.account_bank ?? "").toLowerCase().includes("standard") ||
            String(r.account_bank ?? "").toLowerCase().includes("ubs")
          ),
        successMessage: "Four offshore payoff deposits — Singapore, Hong Kong, Dubai, Zurich.",
        narrativeAfter:
          "All four deposits went to offshore accounts in financial secrecy jurisdictions. The ringleader received ₹85 lakh in HSBC Singapore. That's 5× their annual salary. Now use GROUP BY to confirm who holds the most criminal responsibility.",
      },
      {
        id: "3-8", questId: "3-q2",
        title: "Phase 8: Offshore Bank Distribution",
        description:
          "For every salary deposit greater than ₹10 lakh (1,000,000), GROUP BY account_bank to see the total amount sent to each bank. ORDER BY total DESC. This maps the money laundering network.",
        hint: "submit(SELECT account_bank, COUNT(*) as deposits, SUM(amount) as total FROM salary_deposits WHERE amount > 1000000 GROUP BY account_bank ORDER BY total DESC)",
        validationFn: (rows) =>
          rows.length >= 2 &&
          rows.some((r) => r.account_bank !== undefined && Number(r.total ?? r.deposits ?? 0) > 0),
        successMessage: "Four banks. One sent the most — HSBC Singapore received the largest single deposit.",
        narrativeAfter:
          "HSBC Singapore sits at the top. That's the ringleader's cut. Now use GROUP BY on the transactions themselves — find who approved the most fraudulent transfers. The person at the top is the architect of this entire operation.",
      },

      // ── Quest 3: The Ringleader ────────────────────────────────────────────
      {
        id: "3-9", questId: "3-q3",
        title: "Phase 9: The Ringleader — GROUP BY Approval Count",
        description:
          "Use GROUP BY + HAVING to find the employee who approved ≥ 3 flagged transactions. JOIN financial_transactions with employees. This is the ringleader — they took on the most risk because they had the most control.",
        hint: "submit(SELECT e.full_name, e.role, COUNT(ft.txn_id) as approved_count FROM employees e JOIN financial_transactions ft ON e.emp_id = ft.approved_by WHERE ft.flagged = 1 GROUP BY e.emp_id HAVING COUNT(ft.txn_id) >= 3)",
        validationFn: (rows) =>
          rows.length >= 1 &&
          rows.some((r) =>
            String(r.full_name ?? "").toLowerCase().includes("arun kumar") ||
            Number(r.approved_count ?? r.count ?? 0) >= 3
          ),
        successMessage: "Arun Kumar, DBA Lead — approved 3 of the 6 fraudulent transfers.",
        narrativeAfter:
          "Arun Kumar. DBA Lead. 12 years of service. Clearance level 5. He personally approved three of the six wire transfers — half the total. He also ran the DISABLE LOGGING command that bought them their cover window.",
      },
      {
        id: "3-10", questId: "3-q3",
        title: "Phase 10: The Accomplices",
        description:
          "Find the two other insiders who received offshore deposits post-heist — NOT the ringleader (emp_id != 10). JOIN salary_deposits with employees WHERE deposit > salary AND deposit_date > '2019-09-13'. These are the ring members.",
        hint: "submit(SELECT e.emp_id, e.full_name, e.role, sd.amount, sd.account_bank FROM employees e JOIN salary_deposits sd ON e.emp_id = sd.emp_id WHERE sd.amount > e.salary AND sd.deposit_date > '2019-09-13' AND e.emp_id != 10)",
        validationFn: (rows) =>
          rows.length >= 2 &&
          rows.some((r) => Number(r.amount ?? 0) > 1000000),
        successMessage: "Vidya Murthy (DBA) and Archana Shetty (Junior DBA) — both received offshore payoffs.",
        narrativeAfter:
          "Vidya Murthy received ₹51 lakh in DBS Hong Kong. Archana Shetty received ₹48 lakh in Standard Chartered Dubai. emp_id 36 (Balaji Krishnan) also appears — ₹62 lakh in UBS Zurich. Three accomplices, one ringleader. The ring is now fully mapped.",
      },
      {
        id: "3-11", questId: "3-q3",
        title: "Phase 11: The Cover-Up Attempt",
        description:
          "Find the FAILED cover-up: the DELETE command someone tried to run on the audit log. Query system_access_logs WHERE action LIKE '%DELETE%'. The status column will show if it succeeded or failed.",
        hint: "submit(SELECT emp_id, action, access_time, status FROM system_access_logs WHERE action LIKE '%DELETE%')",
        validationFn: (rows) =>
          rows.length >= 1 && rows.some((r) => String(r.action ?? "").toLowerCase().includes("delete")),
        successMessage: "emp_id 36 tried to DELETE audit_log entries — but it FAILED. The evidence is intact.",
        narrativeAfter:
          "emp_id 36 (Balaji Krishnan, DBA) attempted to delete all audit log entries from the night of the heist. The command failed because Arun Kumar had already revoked the DELETE privilege in a test — and forgot to re-grant it. One small mistake saved the entire investigation.",
      },
      {
        id: "3-12", questId: "3-q3",
        title: "Phase 12: The Full Criminal Profile",
        description:
          "Generate the complete arrest record for the ringleader. JOIN employees with employee_badges WHERE emp_id = 10 to produce the full profile: name, role, clearance, badge access, and salary.",
        hint: "submit(SELECT e.emp_id, e.full_name, e.department, e.role, e.clearance_level, e.salary, eb.can_access_core_db, eb.can_access_server_room FROM employees e JOIN employee_badges eb ON e.emp_id = eb.emp_id WHERE e.emp_id = 10)",
        validationFn: (rows) =>
          rows.length >= 1 &&
          rows.some((r) =>
            Number(r.emp_id) === 10 ||
            String(r.full_name ?? "").toLowerCase().includes("arun kumar")
          ),
        successMessage: "CASE CLOSED. Arun Kumar and three accomplices arrested.",
        narrativeAfter:
          "Arun Kumar, DBA Lead, clearance level 5, can_access_core_db = 1, annual salary ₹17 lakh — who took home ₹85 lakh in HSBC Singapore. He was arrested at Kempegowda International Airport. His personal laptop contained the entire heist script, a bash file labeled 'nov_payroll_test.sh'. The digital heist that nearly worked — undone by a forgotten permission and a salary deposit.",
      },
    ],
    quests: [
      {
        id: "3-q1",
        title: "Inside NovaPay",
        description: "Map the team, badge access, core banking actions, and the external IP login that exposed the remote attacker.",
        objectiveIds: ["3-1", "3-2", "3-3", "3-4"],
      },
      {
        id: "3-q2",
        title: "The Heist Sequence",
        description: "Identify transfer approvers, calculate total stolen, find the offshore payoffs, and map the money laundering network.",
        objectiveIds: ["3-5", "3-6", "3-7", "3-8"],
      },
      {
        id: "3-q3",
        title: "The Ringleader",
        description: "Use GROUP BY HAVING to name the ringleader, expose the accomplices, find the cover-up attempt, and file the arrest record.",
        objectiveIds: ["3-9", "3-10", "3-11", "3-12"],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CASE 4 — THE VANISHING ACT (Delhi, 2015)
  // 12 phases · 3 quests
  // Skills: CTEs, IN subquery, multiple JOINs, EXISTS, advanced filtering
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 4,
    slug: "the-vanishing-act",
    title: "The Vanishing Act",
    subtitle: "CTEs · Multiple JOINs · IN Subquery · EXISTS · Advanced Filtering",
    difficulty: "Chief Inspector",
    teaser: "A diplomat vanishes the night before treaty talks. Intelligence points to a mole inside the Ministry. Delhi, 2015.",
    briefing:
      "Delhi, April 2015. Ambassador Vikram Oberoi of India's Ministry of External Affairs went missing the night before crucial bilateral treaty talks. His personal secretary last saw him at 19:00. By 23:30 his suite was empty. Intelligence reports from SIGINT units flagged encrypted transmissions on an unofficial CIPHER-7 channel originating inside the Ministry compound that same evening. You have 30 staff records, building access logs, encrypted transmissions, phone records, and intelligence reports. Find the mole who facilitated the Ambassador's disappearance.",
    schema: {
      tables: [
        {
          name: "ministry_staff",
          columns: [
            { name: "staff_id", type: "INT", key: "PK" },
            { name: "full_name", type: "TEXT" },
            { name: "designation", type: "TEXT" },
            { name: "department", type: "TEXT" },
            { name: "clearance", type: "TEXT" },
            { name: "nationality", type: "TEXT" },
            { name: "years_of_service", type: "INT" },
            { name: "direct_report_to", type: "INT" },
          ],
        },
        {
          name: "building_access_log",
          columns: [
            { name: "log_id", type: "INT", key: "PK" },
            { name: "staff_id", type: "INT", key: "FK" },
            { name: "zone", type: "TEXT" },
            { name: "timestamp", type: "DATETIME" },
            { name: "action", type: "TEXT" },
            { name: "badge_type", type: "TEXT" },
          ],
          references: [{ column: "staff_id", refTable: "ministry_staff", refColumn: "staff_id" }],
        },
        {
          name: "encrypted_transmissions",
          columns: [
            { name: "msg_id", type: "INT", key: "PK" },
            { name: "sender_id", type: "INT", key: "FK" },
            { name: "receiver_code", type: "TEXT" },
            { name: "sent_at", type: "DATETIME" },
            { name: "channel", type: "TEXT" },
            { name: "classification", type: "TEXT" },
            { name: "decoded_summary", type: "TEXT" },
          ],
          references: [{ column: "sender_id", refTable: "ministry_staff", refColumn: "staff_id" }],
        },
        {
          name: "diplomatic_meetings",
          columns: [
            { name: "meeting_id", type: "INT", key: "PK" },
            { name: "title", type: "TEXT" },
            { name: "location", type: "TEXT" },
            { name: "scheduled_time", type: "DATETIME" },
            { name: "attendees", type: "TEXT" },
            { name: "status", type: "TEXT" },
          ],
        },
        {
          name: "phone_records",
          columns: [
            { name: "call_id", type: "INT", key: "PK" },
            { name: "caller_id", type: "INT", key: "FK" },
            { name: "callee_number", type: "TEXT" },
            { name: "call_time", type: "DATETIME" },
            { name: "duration_sec", type: "INT" },
            { name: "call_type", type: "TEXT" },
            { name: "flagged", type: "INT" },
          ],
          references: [{ column: "caller_id", refTable: "ministry_staff", refColumn: "staff_id" }],
        },
        {
          name: "intelligence_reports",
          columns: [
            { name: "report_id", type: "INT", key: "PK" },
            { name: "source", type: "TEXT" },
            { name: "report_date", type: "DATE" },
            { name: "subject", type: "TEXT" },
            { name: "risk_level", type: "TEXT" },
            { name: "summary", type: "TEXT" },
          ],
        },
      ],
    },
    objectives: [
      // ── Quest 1: The Intelligence Picture ─────────────────────────────────
      {
        id: "4-1", questId: "4-q1",
        title: "Phase 1: Read the Intelligence Reports",
        description:
          "Intelligence has flagged this situation weeks in advance. Query intelligence_reports to find all reports with risk_level = 'CRITICAL'. ORDER BY report_date. These are the pre-warnings that should have prevented the disappearance.",
        hint: "submit(SELECT report_id, report_date, subject, summary FROM intelligence_reports WHERE risk_level = 'CRITICAL' ORDER BY report_date)",
        validationFn: (rows) =>
          rows.length >= 1 && rows.some((r) => String(r.risk_level ?? "").includes("CRITICAL") ||
            String(r.subject ?? r.summary ?? "").includes("CIPHER")),
        successMessage: "2 CRITICAL reports — both flagged CIPHER-7 activity from inside the Ministry.",
        narrativeAfter:
          "The SIGINT unit flagged CIPHER-7 channel activity on March 28th — two weeks before the disappearance. A second CRITICAL report on April 2nd specifically noted the channel activated twice between 21:30 and 22:10 from INSIDE the compound. Someone ignored these warnings.",
      },
      {
        id: "4-2", questId: "4-q1",
        title: "Phase 2: TOP SECRET Clearance Staff",
        description:
          "The CIPHER-7 channel requires TOP SECRET clearance to even know it exists. Find all Ministry staff with clearance = 'TOP SECRET'. These are the only people capable of initiating a CIPHER-7 transmission.",
        hint: "submit(SELECT staff_id, full_name, designation, department, nationality FROM ministry_staff WHERE clearance = 'TOP SECRET' ORDER BY years_of_service DESC)",
        validationFn: (rows) =>
          rows.length >= 3 && rows.some((r) => String(r.clearance ?? "").includes("TOP SECRET")),
        successMessage: "3 TOP SECRET clearance staff. The mole is among them.",
        narrativeAfter:
          "Three people hold TOP SECRET clearance: the Ambassador himself (staff_id 1), the Intelligence Liaison (staff_id 9), and the Code Room Officer (staff_id 22). The Ambassador is the victim. That leaves two suspects.",
      },
      {
        id: "4-3", questId: "4-q1",
        title: "Phase 3: Who Accessed the Treaty Vault?",
        description:
          "Before the disappearance, someone accessed the TREATY_DOCS_VAULT on April 2nd. JOIN building_access_log with ministry_staff to find staff names, timestamps, and their designations. Only staff with SECRET or higher could enter.",
        hint: "submit(SELECT ms.full_name, ms.designation, bal.timestamp, bal.action FROM building_access_log bal JOIN ministry_staff ms ON bal.staff_id = ms.staff_id WHERE bal.zone = 'TREATY_DOCS_VAULT' AND bal.timestamp LIKE '2015-04-02%' ORDER BY bal.timestamp)",
        validationFn: (rows) =>
          rows.length >= 2 && rows.some((r) => r.full_name !== undefined && r.timestamp !== undefined),
        successMessage: "4 staff accessed the Treaty Vault — including senior political and economic advisors.",
        narrativeAfter:
          "The treaty document vault was accessed by four staff members during the day. None are directly suspicious — but the digests of treaty terms they viewed were likely what got transmitted via CIPHER-7 that evening. Check the Cipher Room next.",
      },
      {
        id: "4-4", questId: "4-q1",
        title: "Phase 4: The CIPHER-7 Transmissions",
        description:
          "Query encrypted_transmissions for messages sent on channel = 'CIPHER-7' on April 2nd. JOIN with ministry_staff to identify the sender's full name, clearance, and designation. This is the smoking gun.",
        hint: "submit(SELECT ms.full_name, ms.clearance, ms.designation, et.sent_at, et.receiver_code FROM encrypted_transmissions et JOIN ministry_staff ms ON et.sender_id = ms.staff_id WHERE et.channel = 'CIPHER-7' AND et.sent_at LIKE '2015-04-02%')",
        validationFn: (rows) =>
          rows.length >= 2 &&
          rows.some((r) =>
            String(r.full_name ?? "").toLowerCase().includes("suhana") ||
            String(r.receiver_code ?? "").includes("EXTERNAL-UNKNOWN")
          ),
        successMessage: "Two CIPHER-7 transmissions — both from the Code Room Officer, to EXTERNAL-UNKNOWN.",
        narrativeAfter:
          "Both transmissions were sent by staff_id 22 — the Code Room Officer, the only non-Intelligence person with CIPHER-7 access. The receiver 'EXTERNAL-UNKNOWN' is a burner relay. The second transmission was sent at 22:05 — right after the Ambassador left his suite.",
      },

      // ── Quest 2: The Cipher Trail ──────────────────────────────────────────
      {
        id: "4-5", questId: "4-q2",
        title: "Phase 5: Cipher Room Physical Access",
        description:
          "Who was physically present in the CIPHER_ROOM on April 2nd? JOIN building_access_log with ministry_staff to get their full names, departments, and timestamps. Order by timestamp.",
        hint: "submit(SELECT ms.full_name, ms.department, bal.timestamp, bal.action FROM building_access_log bal JOIN ministry_staff ms ON bal.staff_id = ms.staff_id WHERE bal.zone = 'CIPHER_ROOM' AND bal.timestamp LIKE '2015-04-02%' ORDER BY bal.timestamp)",
        validationFn: (rows) =>
          rows.length >= 2 &&
          rows.some((r) =>
            String(r.full_name ?? "").toLowerCase().includes("suhana") ||
            String(r.department ?? "").toLowerCase().includes("communications")
          ),
        successMessage: "Two staff entered the Cipher Room — both at different times.",
        narrativeAfter:
          "Staff_id 22 (Suhana Malik, Communications) entered the Cipher Room at 20:30 — 3 minutes before the first CIPHER-7 transmission was sent at 21:30. Staff_id 9 (Intelligence Liaison Tariq Hassan) entered at 21:00 for his routine check-in. Their timings tell different stories.",
      },
      {
        id: "4-6", questId: "4-q2",
        title: "Phase 6: Build the Full Night Timeline",
        description:
          "Build a complete timeline of all secure zone activity between 20:00 and 23:30 on April 2nd. JOIN building_access_log with ministry_staff. Filter by timestamp range and ORDER BY timestamp. This reveals who was where, when.",
        hint: "submit(SELECT ms.full_name, ms.designation, bal.zone, bal.timestamp, bal.action FROM building_access_log bal JOIN ministry_staff ms ON bal.staff_id = ms.staff_id WHERE bal.timestamp > '2015-04-02 20:00' AND bal.timestamp < '2015-04-02 23:30' ORDER BY bal.timestamp)",
        validationFn: (rows) =>
          rows.length >= 5 && rows.some((r) => r.zone !== undefined && r.timestamp !== undefined),
        successMessage: "Full timeline built. Suhana Malik's movements cluster around the transmission windows.",
        narrativeAfter:
          "The timeline is damning: 20:30 — Suhana enters Cipher Room. 21:30 — First CIPHER-7 transmission sent. 22:05 — Second transmission. 22:10 — Suhana exits Cipher Room. 23:18 — Ambassador leaves his suite (captured on corridor camera). 23:20 — Perimeter gate override logged. 23:30 — Ambassador missing.",
      },
      {
        id: "4-7", questId: "4-q2",
        title: "Phase 7: The Flagged Phone Calls",
        description:
          "Telecoms monitoring flagged certain international calls as suspicious. JOIN phone_records with ministry_staff to find all flagged calls made on April 2nd. Include caller name, callee number, time, and duration.",
        hint: "submit(SELECT ms.full_name, ms.designation, pr.callee_number, pr.call_time, pr.duration_sec FROM phone_records pr JOIN ministry_staff ms ON pr.caller_id = ms.staff_id WHERE pr.flagged = 1 AND pr.call_time LIKE '2015-04-02%' ORDER BY pr.call_time)",
        validationFn: (rows) =>
          rows.length >= 2 &&
          rows.some((r) =>
            String(r.full_name ?? "").toLowerCase().includes("suhana") ||
            String(r.callee_number ?? "").includes("+971")
          ),
        successMessage: "Three flagged calls to a UAE burner number — all from the same person.",
        narrativeAfter:
          "Three calls to +971-50-XXX-XXXX — a UAE-registered burner. 21:35 (312 seconds), 22:08 (148 seconds), 23:00 (420 seconds). The 23:00 call lasted 7 minutes. The Ambassador disappeared 30 minutes later. The handler was coordinating the intercept in real time.",
      },
      {
        id: "4-8", questId: "4-q2",
        title: "Phase 8: COUNT the Flagged Calls per Person",
        description:
          "Use GROUP BY and COUNT to find who made the most flagged international calls. JOIN phone_records with ministry_staff WHERE flagged = 1. Group by caller_id and show total calls and total duration. ORDER BY call count DESC.",
        hint: "submit(SELECT ms.full_name, COUNT(pr.call_id) as flagged_calls, SUM(pr.duration_sec) as total_duration_sec FROM phone_records pr JOIN ministry_staff ms ON pr.caller_id = ms.staff_id WHERE pr.flagged = 1 GROUP BY pr.caller_id ORDER BY flagged_calls DESC)",
        validationFn: (rows) =>
          rows.length >= 1 &&
          rows.some((r) =>
            String(r.full_name ?? "").toLowerCase().includes("suhana") ||
            Number(r.flagged_calls ?? r.count ?? 0) >= 3
          ),
        successMessage: "Suhana Malik: 3 flagged calls, 880 total seconds on the phone with her handler.",
        narrativeAfter:
          "Suhana Malik — 3 flagged calls, 880 seconds. No one else in the Ministry had even one flagged call. The GROUP BY shows one person in sharp relief against the baseline noise. Now use a subquery to formally prove she is the intersection of all our evidence threads.",
      },

      // ── Quest 3: Naming the Mole ───────────────────────────────────────────
      {
        id: "4-9", questId: "4-q3",
        title: "Phase 9: The IN Subquery — Formal Identification",
        description:
          "Use a subquery with IN to find the staff member who appears in BOTH the CIPHER-7 transmissions AND the flagged phone calls. Submit a query returning their full_name, designation, department, clearance, and nationality.",
        hint: `submit(SELECT full_name, designation, department, clearance, nationality FROM ministry_staff WHERE staff_id IN (SELECT DISTINCT sender_id FROM encrypted_transmissions WHERE channel = 'CIPHER-7') AND staff_id IN (SELECT DISTINCT caller_id FROM phone_records WHERE flagged = 1))`,
        validationFn: (rows) =>
          rows.length >= 1 &&
          rows.some((r) =>
            String(r.full_name ?? "").toLowerCase().includes("suhana malik") ||
            (String(r.designation ?? "").toLowerCase().includes("code room") &&
              String(r.clearance ?? "").includes("TOP SECRET"))
          ),
        successMessage: "Suhana Malik. Code Room Officer. TOP SECRET clearance. Confirmed.",
        narrativeAfter:
          "The subquery returns exactly one row: Suhana Malik. The intersection is clean. She sent the CIPHER-7 transmissions AND made the flagged calls. But let's build the complete picture before formal arrest — check the diplomatic fallout.",
      },
      {
        id: "4-10", questId: "4-q3",
        title: "Phase 10: The Diplomatic Fallout",
        description:
          "The Ambassador's disappearance cancelled all summit meetings. Query diplomatic_meetings WHERE status LIKE '%CANCELLED%'. ORDER BY scheduled_time. Understand what Suhana's betrayal cost the nation.",
        hint: "submit(SELECT title, scheduled_time, location, status FROM diplomatic_meetings WHERE status LIKE '%CANCELLED%' ORDER BY scheduled_time)",
        validationFn: (rows) =>
          rows.length >= 3 &&
          rows.some((r) => String(r.status ?? "").includes("CANCELLED")),
        successMessage: "5 meetings cancelled — including the landmark bilateral treaty signing.",
        narrativeAfter:
          "Five scheduled events — including the flagship bilateral treaty — were cancelled. The geopolitical damage extends beyond one case. Treaties worth billions, alliances in question, an Ambassador traumatised. The scale of the betrayal is now clear.",
      },
      {
        id: "4-11", questId: "4-q3",
        title: "Phase 11: The EXISTS Check — Corroborate with Secure Zone Access",
        description:
          "Final corroboration: use EXISTS to find all staff who have sent encrypted transmissions AND have building access logs on the same day. This proves physical presence during the transmission events.",
        hint: `submit(SELECT ms.full_name, ms.designation, ms.clearance FROM ministry_staff ms WHERE EXISTS (SELECT 1 FROM encrypted_transmissions et WHERE et.sender_id = ms.staff_id AND et.sent_at LIKE '2015-04-02%') AND EXISTS (SELECT 1 FROM building_access_log bal WHERE bal.staff_id = ms.staff_id AND bal.timestamp LIKE '2015-04-02%'))`,
        validationFn: (rows) =>
          rows.length >= 1 &&
          rows.some((r) =>
            String(r.full_name ?? "").toLowerCase().includes("suhana") ||
            (r.designation !== undefined && r.clearance !== undefined)
          ),
        successMessage: "EXISTS confirmed: Suhana was physically present AND sent the transmissions.",
        narrativeAfter:
          "The EXISTS query proves physical-logical correlation: Suhana Malik was in the building at the exact times the CIPHER-7 transmissions were sent. No remote access theory holds. She was there. She sent them. She made the calls. This case is watertight.",
      },
      {
        id: "4-12", questId: "4-q3",
        title: "Phase 12: The Mole's Complete Profile — Arrest Record",
        description:
          "Generate the complete arrest record. Query ministry_staff for Suhana Malik with a subquery that also pulls her total number of encrypted transmissions as 'transmissions_sent'. This is the final submission.",
        hint: `submit(SELECT ms.full_name, ms.designation, ms.department, ms.clearance, ms.nationality, ms.years_of_service, (SELECT COUNT(*) FROM encrypted_transmissions et WHERE et.sender_id = ms.staff_id) as transmissions_sent FROM ministry_staff ms WHERE ms.full_name = 'Suhana Malik')`,
        validationFn: (rows) =>
          rows.length >= 1 &&
          rows.some((r) =>
            String(r.full_name ?? "").toLowerCase().includes("suhana malik") ||
            (String(r.designation ?? "").toLowerCase().includes("code room"))
          ),
        successMessage: "CASE CLOSED. Suhana Malik arrested. Ambassador recovered.",
        narrativeAfter:
          "Suhana Malik. Code Room Officer. Communications. TOP SECRET clearance. 15 years of service. 2 CIPHER-7 transmissions. 3 flagged international calls. 880 seconds coordinating a kidnapping. She was arrested at Indira Gandhi International Airport attempting to board a flight to Dubai. Ambassador Oberoi was recovered unharmed 72 hours later. The treaty was signed. The mole is neutralised.",
      },
    ],
    quests: [
      {
        id: "4-q1",
        title: "The Intelligence Picture",
        description: "Read the pre-warnings, identify TOP SECRET staff, trace treaty vault access, and find the CIPHER-7 transmissions.",
        objectiveIds: ["4-1", "4-2", "4-3", "4-4"],
      },
      {
        id: "4-q2",
        title: "The Cipher Trail",
        description: "Confirm physical presence in the Cipher Room, build the night timeline, and track the flagged phone calls to the foreign handler.",
        objectiveIds: ["4-5", "4-6", "4-7", "4-8"],
      },
      {
        id: "4-q3",
        title: "Naming the Mole",
        description: "Use IN subquery, EXISTS, and correlated subqueries to formally identify, corroborate, and arrest the mole.",
        objectiveIds: ["4-9", "4-10", "4-11", "4-12"],
      },
    ],
  },
];
