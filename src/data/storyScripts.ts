/**
 * Story Scripts — cinematic dialog for all case arcs.
 * Each character has a distinct voice profile for Web Speech API.
 */

export type CharacterName =
  | "NARRATOR"
  | "BYOMKESH"
  | "ARCHIVIST"
  | "INSPECTOR_DAS"
  | "LATA"
  | "VIKRAM"
  | "ALICE"
  | "RACHEL"
  | "SYSTEM";

export type Emotion = "neutral" | "excited" | "suspicious" | "shocked" | "grave" | "smug" | "sad";

export interface VoiceProfile {
  pitch: number;   // 0.5–2.0
  rate: number;    // 0.5–2.0
  volume: number;  // 0.0–1.0
}

export const CHARACTER_VOICES: Record<CharacterName, VoiceProfile> = {
  NARRATOR:      { pitch: 0.85, rate: 0.78, volume: 1.0 },
  BYOMKESH:      { pitch: 1.05, rate: 0.90, volume: 1.0 },
  ARCHIVIST:     { pitch: 1.15, rate: 1.00, volume: 0.9 },
  INSPECTOR_DAS: { pitch: 0.75, rate: 0.85, volume: 1.0 },
  LATA:          { pitch: 1.35, rate: 0.95, volume: 0.85 },
  VIKRAM:        { pitch: 0.80, rate: 0.88, volume: 1.0 },
  ALICE:         { pitch: 1.20, rate: 1.05, volume: 0.9 },
  RACHEL:        { pitch: 1.10, rate: 0.92, volume: 1.0 },
  SYSTEM:        { pitch: 0.70, rate: 0.80, volume: 0.85 },
};

export const CHARACTER_DISPLAY: Record<CharacterName, { name: string; color: string }> = {
  NARRATOR:      { name: "— Narrator —",       color: "#b8a67d" },
  BYOMKESH:      { name: "Byomkesh Bakshi",     color: "#f0c040" },
  ARCHIVIST:     { name: "The Archivist",       color: "#7dd3fc" },
  INSPECTOR_DAS: { name: "Inspector Das",       color: "#f87171" },
  LATA:          { name: "Lata Shankar",        color: "#d8b4fe" },
  VIKRAM:        { name: "Viktor Petrov",       color: "#fb923c" },
  ALICE:         { name: "Alice Monroe",        color: "#86efac" },
  RACHEL:        { name: "Rachel Torres",       color: "#f87171" },
  SYSTEM:        { name: "[ SYSTEM ]",          color: "#4ade80" },
};

export interface DialogLine {
  character: CharacterName;
  text: string;
  emotion?: Emotion;
  pause?: number; // ms to wait after this line before auto-advancing (0 = wait for click)
}

export interface QuestScript {
  questId: string;
  intro: DialogLine[];
  midpoints?: {
    afterObjectiveId: string;
    lines: DialogLine[];
  }[];
  outro: DialogLine[];
}

export interface ArcScript {
  caseId: number;
  arcIntro: DialogLine[];    // Plays before case starts
  quests: QuestScript[];
  arcOutro: DialogLine[];    // Plays after all quests complete
}

// ────────────────────────────────────────────────────────────────────────────
// CASE 1: THE ROYAL RUBY
// ────────────────────────────────────────────────────────────────────────────
const CASE_1_SCRIPT: ArcScript = {
  caseId: 1,

  arcIntro: [
    {
      character: "NARRATOR",
      text: "Calcutta. October 4th, 1946. The monsoon has finally broken, and the city exhales its relief in rivers of mud and jasmine smoke.",
      emotion: "neutral",
    },
    {
      character: "NARRATOR",
      text: "At the Sovabazar Rajbari — ancestral home of the Chatterjee family — a grand soirée is underway. Eight hundred guests. Champagne. And, under a velvet canopy in the east hall, the Surya Ruby.",
      emotion: "neutral",
    },
    {
      character: "NARRATOR",
      text: "A 94-carat pigeon-blood ruby. Valued at forty lakh rupees. The crown jewel of three generations of Chatterjee pride.",
      emotion: "grave",
    },
    {
      character: "NARRATOR",
      text: "At 8:15 in the evening... the lights go out.",
      emotion: "shocked",
    },
    {
      character: "NARRATOR",
      text: "When they come back on — the velvet canopy is empty.",
      emotion: "grave",
    },
    {
      character: "INSPECTOR_DAS",
      text: "Open and shut, I tell you! The electrician — Raju — was the last one in the fuse room. Clap him in irons and be done with it!",
      emotion: "excited",
    },
    {
      character: "BYOMKESH",
      text: "My dear Das. You have arrested the man who controls the darkness. You have not asked who controls the thief.",
      emotion: "smug",
    },
    {
      character: "BYOMKESH",
      text: "Archivist — the evidence terminal is ready. Seven tables. Ten queries. The truth is in the data. Let us find it before dawn.",
      emotion: "neutral",
    },
    {
      character: "ARCHIVIST",
      text: "Ready, Satyanweshi. The database is live. Where do we begin?",
      emotion: "neutral",
    },
  ],

  quests: [
    // ── QUEST 1: The Night of the Blackout ──────────────────────────────────
    {
      questId: "1-q1",
      intro: [
        {
          character: "BYOMKESH",
          text: "First — the timeline. Every crime has a heartbeat. Find the exact minute this one began. Query the police FIR logs.",
          emotion: "neutral",
        },
        {
          character: "ARCHIVIST",
          text: "The FIR logs. Got it. What am I looking for?",
          emotion: "neutral",
        },
        {
          character: "BYOMKESH",
          text: "The reported time for an incident at 'Sovabazar Rajbari'. That is our anchor.",
          emotion: "neutral",
        },
      ],
      midpoints: [
        {
          afterObjectiveId: "1-1",
          lines: [
            {
              character: "BYOMKESH",
              text: "20:15. There it is. Anyone who departed before that minute is innocent. Our thief was still inside when the ruby was taken.",
              emotion: "neutral",
            },
            {
              character: "BYOMKESH",
              text: "Now — the guest list. Das let everyone go in the chaos. Find who was still in the building when the lights died.",
              emotion: "neutral",
            },
          ],
        },
        {
          afterObjectiveId: "1-2",
          lines: [
            {
              character: "BYOMKESH",
              text: "You see this? Departure time '00:00:00' — the staff code for an unrecorded exit. Someone slipped out without signing the register.",
              emotion: "suspicious",
            },
            {
              character: "BYOMKESH",
              text: "Guest 42. Citizen ID 1042. He arrived at 18:30 and never officially left. Keep that number. Now — the footprint.",
              emotion: "excited",
            },
            {
              character: "INSPECTOR_DAS",
              text: "What footprint? My men found nothing!",
              emotion: "neutral",
            },
            {
              character: "BYOMKESH",
              text: "Because your men were looking at the electrician, Das. I was looking at the corridor. Muddy print. Size ten. Kolhapuri chappal.",
              emotion: "smug",
            },
          ],
        },
      ],
      outro: [
        {
          character: "BYOMKESH",
          text: "Sixty men in Calcutta wear size ten Kolhapuri chappals. Too many. But now we have evidence of a very specific sweet tooth.",
          emotion: "neutral",
        },
        {
          character: "ARCHIVIST",
          text: "A sweet tooth? In the middle of a heist investigation?",
          emotion: "excited",
        },
        {
          character: "BYOMKESH",
          text: "The thief dropped a Nalen Gur Sandesh on his way out. Crushed under his heel, but still fragrant. That narrows everything.",
          emotion: "smug",
        },
      ],
    },

    // ── QUEST 2: Trail of the Sweet Tooth ──────────────────────────────────
    {
      questId: "1-q2",
      intro: [
        {
          character: "BYOMKESH",
          text: "The sweet shop orders from October 4th. Someone bought Nalen Gur Sandesh that day. Find who.",
          emotion: "neutral",
        },
        {
          character: "ARCHIVIST",
          text: "And then cross-reference with the footprint suspects?",
          emotion: "neutral",
        },
        {
          character: "BYOMKESH",
          text: "Precisely. Three conditions. Size ten feet. Kolhapuri preference. A Nalen Gur purchase on the day of the theft. Only one person fits all three.",
          emotion: "neutral",
        },
      ],
      midpoints: [
        {
          afterObjectiveId: "1-4",
          lines: [
            {
              character: "BYOMKESH",
              text: "Fifteen sweet buyers. Now — the intersection. Who appears on both lists?",
              emotion: "excited",
            },
          ],
        },
        {
          afterObjectiveId: "1-5",
          lines: [
            {
              character: "BYOMKESH",
              text: "Three men. Amitava Bose. Bhavani Shankar. Devdas Mukherjee. One of these three men stole the Surya Ruby.",
              emotion: "grave",
            },
            {
              character: "INSPECTOR_DAS",
              text: "Then arrest all three! Sort it out at the station!",
              emotion: "excited",
            },
            {
              character: "BYOMKESH",
              text: "Das. We do not arrest innocent men. The thief also dropped a tram ticket stub. Prefix T-89. Find where that tram goes.",
              emotion: "neutral",
            },
          ],
        },
        {
          afterObjectiveId: "1-6",
          lines: [
            {
              character: "BYOMKESH",
              text: "Shyambazar. Tram T-89 goes to Shyambazar. Now — which of our three suspects lives there?",
              emotion: "excited",
            },
          ],
        },
      ],
      outro: [
        {
          character: "ARCHIVIST",
          text: "Bhavani Shankar. He lives in Shyambazar. He bought Nalen Gur Sandesh. He wears size ten Kolhapuri chappals. He never signed out.",
          emotion: "excited",
        },
        {
          character: "BYOMKESH",
          text: "And yet... a man does not steal a 94-carat ruby just to sell it on the black market. He would need to cut it. Break it apart. And for that, he would need a very particular skill.",
          emotion: "suspicious",
        },
      ],
    },

    // ── QUEST 3: The Gem Cutter's Secret ────────────────────────────────────
    {
      questId: "1-q3",
      intro: [
        {
          character: "BYOMKESH",
          text: "Bhavani Shankar's employment history. Pull his records. Find what he did before this affair — and why he stopped.",
          emotion: "neutral",
        },
        {
          character: "ARCHIVIST",
          text: "Citizen ID 1042. On it.",
          emotion: "neutral",
        },
      ],
      midpoints: [
        {
          afterObjectiveId: "1-8",
          lines: [
            {
              character: "BYOMKESH",
              text: "Master Gem Cutter. Fired for embezzlement from Sovabazar Gem Works — the Chatterjee family's own gem workshop.",
              emotion: "shocked",
            },
            {
              character: "BYOMKESH",
              text: "He knows the stones. He knows the family. He knows exactly how to cut the Surya Ruby into a dozen untraceable pieces by dawn.",
              emotion: "grave",
            },
            {
              character: "BYOMKESH",
              text: "But a gem cutter alone cannot cut the power to a mansion. He had someone on the inside. Check the Rajbari staff list.",
              emotion: "suspicious",
            },
          ],
        },
        {
          afterObjectiveId: "1-9",
          lines: [
            {
              character: "ARCHIVIST",
              text: "Lata Shankar. A maid. The same surname.",
              emotion: "shocked",
            },
            {
              character: "BYOMKESH",
              text: "His niece. She unlocked the fuse box. He walked in through the servant's entrance. Raju the electrician was set up to take the blame.",
              emotion: "grave",
            },
            {
              character: "INSPECTOR_DAS",
              text: "Good God.",
              emotion: "shocked",
            },
            {
              character: "BYOMKESH",
              text: "One final query, Archivist. Generate the arrest warrant. I want it in writing.",
              emotion: "neutral",
            },
          ],
        },
      ],
      outro: [
        {
          character: "NARRATOR",
          text: "The police raided the apartment in Shyambazar at 3:47 in the morning.",
          emotion: "neutral",
        },
        {
          character: "NARRATOR",
          text: "Bhavani Shankar was found at his workbench, loupe in eye, the Surya Ruby clamped in a vise — already scored for the first cut.",
          emotion: "grave",
        },
        {
          character: "NARRATOR",
          text: "Lata Shankar was arrested at the Rajbari's servant quarters. She wept throughout.",
          emotion: "sad",
        },
        {
          character: "BYOMKESH",
          text: "Release Raju the electrician. He was innocent from the beginning.",
          emotion: "neutral",
        },
        {
          character: "INSPECTOR_DAS",
          text: "I... yes. Of course. Bakshi — I owe you an apology.",
          emotion: "sad",
        },
        {
          character: "BYOMKESH",
          text: "Apologies are for friends, Das. Save it for Raju.",
          emotion: "neutral",
        },
        {
          character: "NARRATOR",
          text: "The Surya Ruby was returned to the Chatterjee family before sunrise. Byomkesh Bakshi — the Satyanweshi, the Truth-Seeker — had once again found what the police could not.",
          emotion: "neutral",
        },
      ],
    },
  ],

  arcOutro: [
    {
      character: "SYSTEM",
      text: "CASE 001 — THE ROYAL RUBY — CLOSED",
      emotion: "neutral",
      pause: 1500,
    },
    {
      character: "SYSTEM",
      text: "SQL skills demonstrated: SELECT · FROM · WHERE · AND · OR · LIKE · ORDER BY",
      emotion: "neutral",
      pause: 2000,
    },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// CASE 2: THE PHANTOM WITNESS (Mumbai 2003)
// ────────────────────────────────────────────────────────────────────────────
const CASE_2_SCRIPT: ArcScript = {
  caseId: 2,
  arcIntro: [
    { character: "NARRATOR", text: "Mumbai. November 14th, 2003. A political summit of twelve nations. The Oberoi Grand — five-star fortress on Marine Drive.", emotion: "neutral" },
    { character: "NARRATOR", text: "Rajan Mehta, investigative journalist, was found dead in Room 401 at 3:22 in the morning. The 4th floor footage: erased. Eighty guests. One killer.", emotion: "grave" },
    { character: "VIKRAM", text: "This is a diplomatic minefield. We cannot touch VIPs without ironclad proof. The hotel data is all we have.", emotion: "grave" },
    { character: "ARCHIVIST", text: "Hotel systems are live. Room access, phone logs, minibar charges — all in the terminal.", emotion: "neutral" },
  ],
  quests: [
    {
      questId: "2-q1",
      intro: [
        { character: "VIKRAM", text: "Start broad. Eighty guests registered. Who was here for the summit versus tourists? Build the landscape before you narrow it.", emotion: "neutral" },
        { character: "ARCHIVIST", text: "Surveying the guest manifest now.", emotion: "neutral" },
      ],
      midpoints: [
        { afterObjectiveId: "2-1", lines: [
          { character: "VIKRAM", text: "Over thirty summit delegates. Any of them could have had a reason to silence Mehta. Now identify the VIPs — they have unrestricted floor access.", emotion: "suspicious" },
        ]},
        { afterObjectiveId: "2-2", lines: [
          { character: "VIKRAM", text: "Five VIPs. Any of them could walk onto Floor 4 without triggering standard alerts. But let's look at who actually did. Pull the Room 401 access log.", emotion: "neutral" },
        ]},
        { afterObjectiveId: "2-3", lines: [
          { character: "VIKRAM", text: "Three intrusions. Three different key types. Now join the access log to guest records — I need names and nationalities.", emotion: "grave" },
        ]},
      ],
      outro: [
        { character: "ARCHIVIST", text: "Morozov, Sobol, Petrov. All Russian nationals. All here for 'Business.'", emotion: "suspicious" },
        { character: "VIKRAM", text: "Three men who entered a journalist's room after midnight. One of them killed him. Now we trace backward through the night.", emotion: "grave" },
      ],
    },
    {
      questId: "2-q2",
      intro: [
        { character: "VIKRAM", text: "The phone records are crucial. A killer plans. Planning means calls. Pull every call made to Room 401.", emotion: "neutral" },
      ],
      midpoints: [
        { afterObjectiveId: "2-5", lines: [
          { character: "VIKRAM", text: "Room 510 — Morozov — called 401 twice. Then immediately placed an external call for 3 minutes. That's the signal call. Check the external calls during the murder window.", emotion: "suspicious" },
        ]},
        { afterObjectiveId: "2-6", lines: [
          { character: "VIKRAM", text: "One external call. Room 510. 23:55. Three minutes. The footage was wiped between 23:30 and 02:30 — Morozov entered Room 401 at 01:12. Check his minibar. A nervous man drinks.", emotion: "grave" },
        ]},
        { afterObjectiveId: "2-7", lines: [
          { character: "VIKRAM", text: "Whisky at 21:30. Champagne at 00:30 — that's his alibi order. Placed AFTER the murder window opened. He's staging an alibi. Now check if hotel staff with master keys could've assisted.", emotion: "neutral" },
        ]},
      ],
      outro: [
        { character: "ARCHIVIST", text: "Four night staff with master keys. None appear in the Room 401 access log. He acted alone.", emotion: "neutral" },
        { character: "VIKRAM", text: "Good. The motive is next. What did Rajan Mehta write about Viktor Morozov?", emotion: "suspicious" },
      ],
    },
    {
      questId: "2-q3",
      intro: [
        { character: "VIKRAM", text: "Three angles left: motive, timeline, and the champagne alibi. Each one is a nail in the coffin. Start with the motive.", emotion: "neutral" },
      ],
      midpoints: [
        { afterObjectiveId: "2-9", lines: [
          { character: "VIKRAM", text: "Morozov threatened to sue over a ₹800 crore loss. That's a motive. Now reconstruct his entire night — every room he accessed, every move he made.", emotion: "grave" },
        ]},
        { afterObjectiveId: "2-10", lines: [
          { character: "VIKRAM", text: "Entry at 01:12. Exit at 01:47. Medical examiner: death between 01:15 and 01:45. He was inside. Now destroy the champagne alibi.", emotion: "shocked" },
        ]},
        { afterObjectiveId: "2-11", lines: [
          { character: "ARCHIVIST", text: "Champagne ordered at 00:30 — 42 minutes before he entered Room 401. Pre-meditated alibi construction.", emotion: "shocked" },
          { character: "VIKRAM", text: "The case is complete. Submit the full guest record. That's our arrest document.", emotion: "neutral" },
        ]},
      ],
      outro: [
        { character: "NARRATOR", text: "Viktor Morozov was apprehended at Terminal 2, Chhatrapati Shivaji International Airport, boarding a private jet to Zurich.", emotion: "neutral" },
        { character: "NARRATOR", text: "He never reached the gate. Rajan Mehta's final story runs tomorrow — posthumously, on the front page.", emotion: "grave" },
      ],
    },
  ],
  arcOutro: [
    { character: "SYSTEM", text: "CASE 002 — THE PHANTOM WITNESS — CLOSED", emotion: "neutral", pause: 1500 },
    { character: "SYSTEM", text: "SQL skills: JOIN · Date Filtering · LIKE · GROUP BY · Correlated Lookups", emotion: "neutral", pause: 2000 },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// CASE 3: THE DIGITAL HEIST (Bangalore 2019)
// ────────────────────────────────────────────────────────────────────────────
const CASE_3_SCRIPT: ArcScript = {
  caseId: 3,
  arcIntro: [
    { character: "NARRATOR", text: "Bangalore. September 12th, 2019. 4:00 AM. The servers at NovaPay Technologies reboot after a 108-minute blackout in the transaction logs.", emotion: "neutral" },
    { character: "NARRATOR", text: "Six wire transfers. Six offshore accounts. Fifty million dollars — gone in four minutes.", emotion: "shocked" },
    { character: "ALICE", text: "The intrusion was internal. Clearance level five. They knew the schema and the monitoring gaps.", emotion: "grave" },
    { character: "ARCHIVIST", text: "Forty employees, system logs, badge records, salary deposits — all loaded. Let's find the thread.", emotion: "neutral" },
  ],
  quests: [
    {
      questId: "3-q1",
      intro: [
        { character: "ALICE", text: "Before the suspects, understand the access model. Who could reach CORE_BANKING_DB? Map the org, then the badges.", emotion: "neutral" },
      ],
      midpoints: [
        { afterObjectiveId: "3-1", lines: [
          { character: "ALICE", text: "Seven Database staff. Three with clearance level 5. Now check who holds the actual badge access to core banking — clearance level alone isn't enough.", emotion: "neutral" },
        ]},
        { afterObjectiveId: "3-2", lines: [
          { character: "ALICE", text: "Nine badge holders. This is our universe of suspects. Now pull the CORE_BANKING_DB logs for the night of the heist.", emotion: "neutral" },
        ]},
        { afterObjectiveId: "3-3", lines: [
          { character: "ALICE", text: "There it is. DISABLE logging. EXPORT commands. A FAILED DELETE. The sequence is textbook. Someone panicked on the delete — that panic saved this investigation. Now find the external IP.", emotion: "shocked" },
        ]},
      ],
      outro: [
        { character: "ALICE", text: "External login at 03:01 from 185.220.101.45 — a Tor exit node. emp_id 19 was controlling the operation remotely.", emotion: "grave" },
        { character: "ARCHIVIST", text: "They had someone in the office AND someone working remotely. This was a ring.", emotion: "neutral" },
      ],
    },
    {
      questId: "3-q2",
      intro: [
        { character: "ALICE", text: "Now follow the money. The transfers, the total, the payoffs. Each query tightens the net.", emotion: "neutral" },
      ],
      midpoints: [
        { afterObjectiveId: "3-5", lines: [
          { character: "ALICE", text: "Three approvers. Three insiders. They split the six transfers deliberately to avoid single-approver fraud alerts. Aggregate the total now.", emotion: "grave" },
        ]},
        { afterObjectiveId: "3-6", lines: [
          { character: "ALICE", text: "₹44.5 million. Six transfers in four minutes. Now check the salary deposits two weeks later — that's the payoff trail.", emotion: "shocked" },
        ]},
        { afterObjectiveId: "3-7", lines: [
          { character: "ALICE", text: "Four offshore deposits. Singapore, Hong Kong, Dubai, Zurich. Now group them by bank — find out who got the biggest cut. The largest cut goes to the ringleader.", emotion: "grave" },
        ]},
      ],
      outro: [
        { character: "ARCHIVIST", text: "HSBC Singapore received the largest single deposit. That's the ringleader's cut.", emotion: "suspicious" },
        { character: "ALICE", text: "Now GROUP BY the transaction approvals. The person who approved the most fraudulent transfers took the most risk — because they had the most control.", emotion: "neutral" },
      ],
    },
    {
      questId: "3-q3",
      intro: [
        { character: "ALICE", text: "Three queries left: the ringleader's identity, the accomplice ring, the cover-up attempt. Then the arrest.", emotion: "neutral" },
      ],
      midpoints: [
        { afterObjectiveId: "3-9", lines: [
          { character: "ALICE", text: "Arun Kumar. Three approvals. DBA Lead. He owns this. Now find the other two who received offshore payoffs.", emotion: "grave" },
        ]},
        { afterObjectiveId: "3-10", lines: [
          { character: "ALICE", text: "Vidya Murthy. Archana Shetty. Balaji Krishnan. The full ring. Now find the cover-up attempt — the DELETE that failed.", emotion: "neutral" },
        ]},
        { afterObjectiveId: "3-11", lines: [
          { character: "ARCHIVIST", text: "Balaji Krishnan tried to delete the audit log. Status: FAILED. One small system constraint saved the entire investigation.", emotion: "shocked" },
          { character: "ALICE", text: "Generate the arrest record. Full profile for Arun Kumar — the architect of the heist.", emotion: "neutral" },
        ]},
      ],
      outro: [
        { character: "NARRATOR", text: "Arun Kumar was arrested at Kempegowda International Airport. His personal laptop: the complete heist script, a bash file labeled 'nov_payroll_test.sh'.", emotion: "neutral" },
        { character: "NARRATOR", text: "The digital heist that nearly worked — undone by a forgotten permission and a salary deposit.", emotion: "grave" },
      ],
    },
  ],
  arcOutro: [
    { character: "SYSTEM", text: "CASE 003 — THE DIGITAL HEIST — CLOSED", emotion: "neutral", pause: 1500 },
    { character: "SYSTEM", text: "SQL skills: GROUP BY · HAVING · SUM/COUNT · NOT LIKE · Subqueries · Multi-table JOIN", emotion: "neutral", pause: 2000 },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// CASE 4: THE VANISHING ACT (Delhi 2015)
// ────────────────────────────────────────────────────────────────────────────
const CASE_4_SCRIPT: ArcScript = {
  caseId: 4,
  arcIntro: [
    { character: "NARRATOR", text: "New Delhi. April 2nd, 2015. Twelve hours before the signing of a landmark bilateral treaty — the Indian Ambassador goes missing.", emotion: "grave" },
    { character: "NARRATOR", text: "No ransom demand. No forced entry. His corridor camera shows him walking toward the exit at 23:18 — and nothing after.", emotion: "shocked" },
    { character: "VIKRAM", text: "This is an intelligence operation. SIGINT flagged unauthorized CIPHER-7 transmissions from inside the compound. Find the source.", emotion: "grave" },
    { character: "ARCHIVIST", text: "Ministry staff, building access, encrypted transmissions, phone records — all loaded. Ready.", emotion: "neutral" },
  ],
  quests: [
    {
      questId: "4-q1",
      intro: [
        { character: "VIKRAM", text: "Start with the intelligence picture. The warnings were there weeks in advance. Understand what SIGINT already knows before you query the primary records.", emotion: "neutral" },
      ],
      midpoints: [
        { afterObjectiveId: "4-1", lines: [
          { character: "VIKRAM", text: "Two CRITICAL reports — both specifically flagging CIPHER-7. Someone read these and did nothing. Now find who even has clearance to USE CIPHER-7.", emotion: "suspicious" },
        ]},
        { afterObjectiveId: "4-2", lines: [
          { character: "VIKRAM", text: "Three TOP SECRET staff. Ambassador is the victim. Intelligence Liaison is routine. Code Room Officer is our focus. Check who accessed the Treaty Vault — that's what got transmitted.", emotion: "neutral" },
        ]},
        { afterObjectiveId: "4-3", lines: [
          { character: "VIKRAM", text: "Four staff accessed the vault. The treaty terms they reviewed — that's the intelligence that was leaked. Now pull the CIPHER-7 transmissions themselves.", emotion: "grave" },
        ]},
      ],
      outro: [
        { character: "ARCHIVIST", text: "Both CIPHER-7 transmissions came from the same person — staff_id 22. Receiver: EXTERNAL-UNKNOWN. A burner relay.", emotion: "shocked" },
        { character: "VIKRAM", text: "The Code Room Officer. Fifteen years of service. And two transmissions sent to a foreign handler. We need to confirm physical presence and the phone contacts.", emotion: "grave" },
      ],
    },
    {
      questId: "4-q2",
      intro: [
        { character: "VIKRAM", text: "Physical presence, timeline, phone contacts. Three corroboration layers. If all three align with one person — the case is bulletproof.", emotion: "neutral" },
      ],
      midpoints: [
        { afterObjectiveId: "4-5", lines: [
          { character: "VIKRAM", text: "Staff_id 22 entered the Cipher Room at 20:30 — three minutes before the first transmission. Staff_id 9 was there for routine check-in. Their time patterns are completely different. Build the full night timeline now.", emotion: "suspicious" },
        ]},
        { afterObjectiveId: "4-6", lines: [
          { character: "VIKRAM", text: "20:30 — Cipher Room entry. 21:30 — First transmission. 22:05 — Second transmission. 22:10 — Exit. 23:18 — Ambassador walks to exit. 23:20 — Perimeter gate override. The timeline is damning. Now find the phone calls.", emotion: "grave" },
        ]},
        { afterObjectiveId: "4-7", lines: [
          { character: "VIKRAM", text: "Three calls to a UAE burner. Now GROUP BY to prove it's concentrated in one person — not noise.", emotion: "neutral" },
        ]},
      ],
      outro: [
        { character: "ARCHIVIST", text: "Suhana Malik. Three flagged calls. 880 seconds total. No one else in the Ministry has even one flagged call.", emotion: "shocked" },
        { character: "VIKRAM", text: "The picture is complete. Now we formalise it with SQL. Subquery. EXISTS. And the final arrest record.", emotion: "grave" },
      ],
    },
    {
      questId: "4-q3",
      intro: [
        { character: "VIKRAM", text: "Four queries. Each one a pillar of the prosecution. IN subquery. Diplomatic impact. EXISTS corroboration. Full profile. Build them one by one.", emotion: "neutral" },
      ],
      midpoints: [
        { afterObjectiveId: "4-9", lines: [
          { character: "ARCHIVIST", text: "The IN subquery returns exactly one row: Suhana Malik. The intersection of CIPHER-7 and flagged calls is a single person.", emotion: "shocked" },
          { character: "VIKRAM", text: "Good. Now understand the national damage — what did her betrayal cost us?", emotion: "grave" },
        ]},
        { afterObjectiveId: "4-10", lines: [
          { character: "VIKRAM", text: "Five events cancelled. A treaty worth billions in abeyance. The scale of the betrayal is extraordinary. Now use EXISTS to corroborate physical presence with transmissions.", emotion: "neutral" },
        ]},
        { afterObjectiveId: "4-11", lines: [
          { character: "VIKRAM", text: "EXISTS confirms it. She was in the building at the exact transmission windows. No remote access theory holds. Generate the arrest record — with her total transmission count.", emotion: "neutral" },
        ]},
      ],
      outro: [
        { character: "NARRATOR", text: "Suhana Malik was arrested at Indira Gandhi International Airport attempting to board a flight to Dubai.", emotion: "neutral" },
        { character: "NARRATOR", text: "Ambassador Oberoi was recovered unharmed 72 hours later through diplomatic back-channels. The treaty was signed the following week.", emotion: "neutral" },
        { character: "VIKRAM", text: "Fifteen years of exemplary service. One recruitment. One betrayal. The mole is neutralised.", emotion: "sad" },
        { character: "ARCHIVIST", text: "And the treaty survives. That has to count for something.", emotion: "neutral" },
      ],
    },
  ],
  arcOutro: [
    { character: "SYSTEM", text: "CASE 004 — THE VANISHING ACT — CLOSED", emotion: "neutral", pause: 1500 },
    { character: "SYSTEM", text: "SQL skills: CTEs · IN Subquery · EXISTS · Multiple JOINs · Correlated Subqueries", emotion: "neutral", pause: 2000 },
  ],
};

export const ALL_SCRIPTS: Record<number, ArcScript> = {
  1: CASE_1_SCRIPT,
  2: CASE_2_SCRIPT,
  3: CASE_3_SCRIPT,
  4: CASE_4_SCRIPT,
};
