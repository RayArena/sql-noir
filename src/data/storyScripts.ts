/**
 * Story Scripts — cinematic dialog for THE BLACK LEDGER CONSPIRACY.
 * Each character has a distinct voice profile for the Web Speech API.
 * Levels 1–3 have full scripts; later levels are added as they ship.
 */

export type CharacterName =
  | "NARRATOR"
  | "KULKARNI"
  | "ARCHIVIST"
  | "IQBAL"
  | "WITNESS"
  | "SUSPECT"
  | "VASUDEV"
  | "INFORMANT"
  | "SYSTEM";

export type Emotion = "neutral" | "excited" | "suspicious" | "shocked" | "grave" | "smug" | "sad";

export interface VoiceProfile {
  pitch: number;   // 0.5–2.0
  rate: number;    // 0.5–2.0
  volume: number;  // 0.0–1.0
}

export const CHARACTER_VOICES: Record<CharacterName, VoiceProfile> = {
  NARRATOR:   { pitch: 0.85, rate: 0.80, volume: 1.0 },
  KULKARNI:   { pitch: 1.0,  rate: 0.92, volume: 1.0 },
  ARCHIVIST:  { pitch: 1.15, rate: 1.0,  volume: 0.9 },
  IQBAL:      { pitch: 1.1,  rate: 1.05, volume: 0.95 },
  WITNESS:    { pitch: 1.3,  rate: 0.95, volume: 0.9 },
  SUSPECT:    { pitch: 0.8,  rate: 0.9,  volume: 1.0 },
  VASUDEV:    { pitch: 0.9,  rate: 0.82, volume: 1.0 },
  INFORMANT:  { pitch: 1.2,  rate: 1.08, volume: 0.9 },
  SYSTEM:     { pitch: 0.7,  rate: 0.80, volume: 0.85 },
};

export const CHARACTER_DISPLAY: Record<CharacterName, { name: string; color: string }> = {
  NARRATOR:   { name: "— Narrator —",           color: "#b8a67d" },
  KULKARNI:   { name: "DI Rhea Kulkarni",        color: "#f0c040" },
  ARCHIVIST:  { name: "The Archivist",           color: "#7dd3fc" },
  IQBAL:      { name: "Constable Iqbal Khan",    color: "#86efac" },
  WITNESS:    { name: "Witness",                 color: "#d8b4fe" },
  SUSPECT:    { name: "Person of Interest",      color: "#fb923c" },
  VASUDEV:    { name: "V. Rao, Records Office",  color: "#f87171" },
  INFORMANT:  { name: "Informant",               color: "#5eead4" },
  SYSTEM:     { name: "[ SYSTEM ]",              color: "#4ade80" },
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
  midpoints?: { afterObjectiveId: string; lines: DialogLine[] }[];
  outro: DialogLine[];
}

export interface ArcScript {
  caseId: number;
  arcIntro: DialogLine[];
  quests: QuestScript[];
  arcOutro: DialogLine[];
}

// ────────────────────────────────────────────────────────────────────────────
// LEVEL 1 — THE VANISHING WITNESS
// ────────────────────────────────────────────────────────────────────────────
const CASE_1_SCRIPT: ArcScript = {
  caseId: 1,
  arcIntro: [
    { character: "NARRATOR", text: "Devgarh. The twelfth of March, a little past midnight. Down at the Old Fort docks, in the quarter they call Purana Qila, a timber godown is burning.", emotion: "grave" },
    { character: "NARRATOR", text: "By dawn the fire is out. The ledgers inside are ash. And a dockhand named Salim Ansari is telling anyone who'll listen that he watched two men load crates onto a launch and vanish downriver.", emotion: "neutral" },
    { character: "NARRATOR", text: "Three days later, Salim Ansari is gone. No note. No body. No trace.", emotion: "shocked" },
    { character: "KULKARNI", text: "A witness doesn't just evaporate, Archivist. Someone made him disappear — and they were tidy about it.", emotion: "suspicious" },
    { character: "IQBAL", text: "Ma'am, the desk wants to close it as a runaway. Says a dockworker skipping town isn't worth the paperwork.", emotion: "neutral" },
    { character: "KULKARNI", text: "The desk can want what it likes. I've pulled every register that touches the Old Fort into the evidence terminal. Archivist — you know the queries. SELECT what we need, WHERE it matters. Find me the last man who saw Salim breathing.", emotion: "grave" },
    { character: "ARCHIVIST", text: "Terminal's live, DI Kulkarni. Four tables loaded. Tell me where to point it.", emotion: "neutral" },
  ],
  quests: [
    {
      questId: "1-q1",
      intro: [
        { character: "KULKARNI", text: "Start simple. I want to see who came forward at all. Read me the whole witness registry, then find Salim's own record.", emotion: "neutral" },
      ],
      outro: [
        { character: "IQBAL", text: "So Salim really is logged as missing since the twelfth. The desk was wrong.", emotion: "excited" },
        { character: "KULKARNI", text: "The desk is usually wrong. Now — the neighborhood. Somebody in Purana Qila knows what happened on that wharf.", emotion: "suspicious" },
      ],
    },
    {
      questId: "1-q2",
      intro: [
        { character: "KULKARNI", text: "Filter the noise. Flagged persons, dockworkers, open files at the Old Fort, and everything logged at the Ferry Wharf. Narrow it down.", emotion: "neutral" },
      ],
      outro: [
        { character: "KULKARNI", text: "Two open files, both ours. Six dockworkers. A wharf busier than the docket admits. We're close.", emotion: "grave" },
      ],
    },
    {
      questId: "1-q3",
      intro: [
        { character: "KULKARNI", text: "Last stretch. Trace Salim's own movements, cross them against our flagged dockworkers, and tell me who stood on that wharf after ten o'clock.", emotion: "suspicious" },
      ],
      outro: [
        { character: "IQBAL", text: "Farhan Qureshi. Twenty-two forty, Ferry Wharf. Same hour Salim was last seen at the godown.", emotion: "shocked" },
        { character: "KULKARNI", text: "He didn't pay for that launch himself — a dockhand doesn't have the money. But he's the loose thread. Pull him, and the whole coat comes apart.", emotion: "grave" },
      ],
    },
  ],
  arcOutro: [
    { character: "NARRATOR", text: "Farhan Qureshi is picked up at a chai stall the next morning, still smelling of river water.", emotion: "neutral" },
    { character: "KULKARNI", text: "He'll talk eventually. They always do. But it's the name behind him I want — whoever could make a witness and a set of ledgers disappear in the same week.", emotion: "suspicious" },
    { character: "VASUDEV", text: "A tragic business, Inspector. I've had the fire report filed and sealed already. One less thing for your desk.", emotion: "smug" },
    { character: "KULKARNI", text: "...Efficient of you, Mr. Rao. Awfully efficient.", emotion: "suspicious" },
    { character: "NARRATOR", text: "The records administrator smiles, and files another paper. Case one is closed. The Black Ledger has only turned its first page.", emotion: "grave" },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// LEVEL 2 — THE HOTEL ON ASH STREET
// ────────────────────────────────────────────────────────────────────────────
const CASE_2_SCRIPT: ArcScript = {
  caseId: 2,
  arcIntro: [
    { character: "NARRATOR", text: "Ash Street runs from Devgarh Junction to the old cantonment, and halfway down it stands the Grand Meridian — a hotel that has kept other people's secrets for a hundred years.", emotion: "neutral" },
    { character: "IQBAL", text: "Farhan cracked, ma'am. Said the launch crew came straight here after the fire. Checked in, paid cash, kept to their rooms.", emotion: "excited" },
    { character: "KULKARNI", text: "Then the guest book is a confession waiting to be read. I've pulled the register, the room-service dockets, and the deposit slips from the branch by the station.", emotion: "suspicious" },
    { character: "ARCHIVIST", text: "Three ledgers loaded. If someone paid too much, an ORDER BY will float them straight to the top.", emotion: "neutral" },
    { character: "KULKARNI", text: "Exactly. Sort the money, LIMIT it to the ones that matter, and show me who's really running this hotel's cash.", emotion: "grave" },
  ],
  quests: [
    {
      questId: "2-q1",
      intro: [{ character: "KULKARNI", text: "Start with the guest book. Rank every guest by what they paid, then skim the top few off the pile.", emotion: "neutral" }],
      outro: [{ character: "KULKARNI", text: "'Meridian Holdings, representative.' A company that pays in lakhs and shows no face. Remember that name.", emotion: "suspicious" }],
    },
    {
      questId: "2-q2",
      intro: [{ character: "KULKARNI", text: "Now the timing. Who stayed longest, who arrived last, and who was pinching pennies on room service.", emotion: "neutral" }],
      outro: [{ character: "IQBAL", text: "They all checked in on the twelfth. The night of the fire. Every one of them.", emotion: "shocked" }],
    },
    {
      questId: "2-q3",
      intro: [{ character: "KULKARNI", text: "Follow the cash. Rank the cash guests, rank the deposits, and find the man who carries money between the coast and this city.", emotion: "suspicious" }],
      outro: [{ character: "KULKARNI", text: "Imtiaz Sayed. Konkan Port. He pays cash here and banks lakhs the next morning. He's the courier — and Meridian Holdings is the hand that pays him.", emotion: "grave" }],
    },
  ],
  arcOutro: [
    { character: "NARRATOR", text: "The deposit slips all trace back to two branches — and both were audited, and cleared, by the same municipal records officer.", emotion: "grave" },
    { character: "VASUDEV", text: "Ah, the Meridian accounts. I signed off on those myself, Inspector. Spotless. You needn't trouble the manager.", emotion: "smug" },
    { character: "KULKARNI", text: "You certify a great many things, Mr. Rao. One day I'll ask who certifies you.", emotion: "suspicious" },
    { character: "NARRATOR", text: "The trail runs to Konkan Port now. But first, a hundred scattered statements must be counted and sorted. Case two is closed.", emotion: "neutral" },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// LEVEL 3 — THE SILENT WITNESSES
// ────────────────────────────────────────────────────────────────────────────
const CASE_3_SCRIPT: ArcScript = {
  caseId: 3,
  arcIntro: [
    { character: "NARRATOR", text: "A week after the fire, the Salim Ansari case has grown teeth. It is no longer one missing dockhand — it is six districts, two dozen statements, and a property room that will not stop filling.", emotion: "grave" },
    { character: "KULKARNI", text: "The Commissioner wants numbers, Archivist, not stories. How many spoke. How many we can trust. How much we've seized and how much is still out there in the dark.", emotion: "neutral" },
    { character: "IQBAL", text: "Four of us took statements across half the city, ma'am. Some of them contradict each other. Some of them contradict themselves.", emotion: "suspicious" },
    { character: "KULKARNI", text: "Then we strip the duplicates and we count. DISTINCT to see who and where. COUNT, SUM, AVG, MIN, MAX to turn a mountain of paper into one clean page. Two tables are loaded — the interviews and the evidence log.", emotion: "grave" },
    { character: "ARCHIVIST", text: "Terminal's ready. Let's find out what the silent witnesses add up to.", emotion: "neutral" },
  ],
  quests: [
    {
      questId: "3-q1",
      intro: [{ character: "KULKARNI", text: "Start by stripping the repeats. Show me the distinct districts, the distinct officers, then the total headcount of statements.", emotion: "neutral" }],
      outro: [{ character: "KULKARNI", text: "Six districts, four officers, twenty-four statements. The case has spread further than anyone upstairs admits.", emotion: "suspicious" }],
    },
    {
      questId: "3-q2",
      intro: [{ character: "KULKARNI", text: "Now weigh the words. Count the Old Fort statements, then average the reliability, and find the longest and the least trustworthy on record.", emotion: "neutral" }],
      outro: [{ character: "IQBAL", text: "The lowest scores all sit at Konkan Gate, ma'am. Somebody down at the coast was reading from a script.", emotion: "shocked" }],
    },
    {
      questId: "3-q3",
      intro: [{ character: "KULKARNI", text: "Last, the evidence. Total the value of the haul, count how many kinds we're holding, then tell me how many witnesses scored high enough to build a case on.", emotion: "suspicious" }],
      outro: [{ character: "KULKARNI", text: "Thirty-five lakh seized, five categories, eight credible witnesses. That's not a runaway dockhand. That's an organisation.", emotion: "grave" }],
    },
  ],
  arcOutro: [
    { character: "NARRATOR", text: "The figures are typed, stamped, and carried up to the Commissioner's floor. For the first time, the Ansari case has a shape.", emotion: "neutral" },
    { character: "VASUDEV", text: "Impressive arithmetic, Inspector. Though I'd caution against reading too much into raw totals — evidence has a way of being miscounted in the property room.", emotion: "smug" },
    { character: "KULKARNI", text: "Nothing gets miscounted on my watch, Mr. Rao. But it's interesting you'd know which room to worry about.", emotion: "suspicious" },
    { character: "NARRATOR", text: "The numbers point inward now — to a precinct where the seizures never quite match the records. Case three is closed. Next, Kulkarni goes looking for the rot.", emotion: "grave" },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// LEVEL 4 — THE CORRUPT PRECINCT
// ────────────────────────────────────────────────────────────────────────────
const CASE_4_SCRIPT: ArcScript = {
  caseId: 4,
  arcIntro: [
    { character: "NARRATOR", text: "Precinct 47 sits behind the tram depot, its property room stacked to the ceiling with other people's confiscated lives. On paper, everything that comes in is accounted for. On paper.", emotion: "neutral" },
    { character: "KULKARNI", text: "The Commissioner's numbers looked clean, Archivist. Too clean. So I pulled the raw seizure logs myself — every crate, every rupee, every desk that touched them.", emotion: "suspicious" },
    { character: "IQBAL", text: "Ma'am, there are hundreds of entries. You can't read them one by one.", emotion: "neutral" },
    { character: "KULKARNI", text: "I don't intend to. We GROUP BY the officer, the desk, the district — turn a hundred lines into a handful of totals. Then we ask HAVING which of those totals refuse to add up. Load the seizure log and the transfer register.", emotion: "grave" },
    { character: "ARCHIVIST", text: "Both tables are up, DI Kulkarni. Let's see which desk is lighter than its paperwork.", emotion: "neutral" },
  ],
  quests: [
    {
      questId: "4-q1",
      intro: [{ character: "KULKARNI", text: "Bucket everything first. Count the seizures per officer, sum the value per district, and see how much each desk booked.", emotion: "neutral" }],
      outro: [{ character: "KULKARNI", text: "Salunke's desk booked more than the rest combined, and the coast districts carry the money. The shape is forming.", emotion: "suspicious" }],
    },
    {
      questId: "4-q2",
      intro: [{ character: "KULKARNI", text: "Now the arithmetic that matters. Rank the desks by value, count what each one lost, and average the categories. I want the gap between logged and recovered.", emotion: "grave" }],
      outro: [{ character: "IQBAL", text: "The Central Store lost seven items, ma'am. Everyone else, one or none.", emotion: "shocked" }],
    },
    {
      questId: "4-q3",
      intro: [{ character: "KULKARNI", text: "Filter the groups. Officers with too many seizures, desks holding too much loss, then the register that says where it all went.", emotion: "suspicious" }],
      outro: [
        { character: "ARCHIVIST", text: "One name authorised seven transfers, all Central Store to the Municipal Records Office. V. Rao.", emotion: "shocked" },
        { character: "KULKARNI", text: "Rao again. He doesn't smuggle. He signs. Every missing crate walked out under his signature and into an office no warrant of mine can enter.", emotion: "grave" },
      ],
    },
  ],
  arcOutro: [
    { character: "NARRATOR", text: "The transfer register tells a clean, terrible story: the evidence didn't disappear. It was relocated, legally, to the one place the law keeps its own memory.", emotion: "grave" },
    { character: "VASUDEV", text: "You've been busy in my logs, Inspector. Everything you found was properly countersigned, I assure you. Chain of custody, all in order.", emotion: "smug" },
    { character: "KULKARNI", text: "Order is exactly what worries me, Mr. Rao. Nothing this tidy happens by accident.", emotion: "suspicious" },
    { character: "NARRATOR", text: "The trail runs on — to a set of accounts and couriers that were never meant to be read side by side. Case four is closed. Next, Kulkarni joins the ledgers.", emotion: "neutral" },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// LEVEL 5 — THE MIDNIGHT EXCHANGE
// ────────────────────────────────────────────────────────────────────────────
const CASE_5_SCRIPT: ArcScript = {
  caseId: 5,
  arcIntro: [
    { character: "NARRATOR", text: "Two ledgers reach DI Kulkarni's desk the same evening. One lists couriers — who they are, where they berth, who runs them. The other lists payments — sums, dates, the accounts behind them. Kept apart, each is dull. Kulkarni has no intention of keeping them apart.", emotion: "neutral" },
    { character: "KULKARNI", text: "Whoever split these files knew what they were doing, Archivist. A courier list means nothing. A payment list means nothing. Put them together and the whole exchange lights up.", emotion: "suspicious" },
    { character: "ARCHIVIST", text: "Two tables, one key — courier_id sits on both. An INNER JOIN pairs the ones that match; a LEFT JOIN shows me the ones that don't.", emotion: "neutral" },
    { character: "KULKARNI", text: "Then join them. Match every courier to their money. And when a payment has no courier — or a courier has no payment — I want to know. Those gaps are where the exchange hides.", emotion: "grave" },
  ],
  quests: [
    {
      questId: "5-q1",
      intro: [{ character: "KULKARNI", text: "Start clean. Pair each courier with what they were paid, then narrow to the coast and total each name's take.", emotion: "neutral" }],
      outro: [{ character: "KULKARNI", text: "Imtiaz and Ravi, the Konkan men, both drawing Meridian's money. Nine payments with a face. But the ledger holds twelve.", emotion: "suspicious" }],
    },
    {
      questId: "5-q2",
      intro: [{ character: "KULKARNI", text: "Now keep the ones the match throws away. Every courier, paid or not — and tell me which of them the money never reached.", emotion: "neutral" }],
      outro: [{ character: "IQBAL", text: "Anwar Sheikh and Yusuf Dalvi are on the courier list, ma'am, but not one payment between them.", emotion: "shocked" }],
    },
    {
      questId: "5-q3",
      intro: [{ character: "KULKARNI", text: "Flip the join. I want the payments with no courier at all — what they're worth, and whose account they came from.", emotion: "suspicious" }],
      outro: [
        { character: "ARCHIVIST", text: "Three payments, seventeen lakh, no courier on any of them — and all three paid by Meridian Holdings.", emotion: "shocked" },
        { character: "KULKARNI", text: "Meridian pays couriers who don't exist. That's not sloppy bookkeeping — that's a channel. The money's moving to someone the ledger won't name. Follow the shipment and it will.", emotion: "grave" },
      ],
    },
  ],
  arcOutro: [
    { character: "NARRATOR", text: "The faceless payments all trace to Meridian Holdings — and every Meridian consignment, Kulkarni already knows, is cleared through the same municipal office.", emotion: "grave" },
    { character: "VASUDEV", text: "Couriers, payments, joins upon joins. You do work hard, Inspector. But a mismatched entry is a clerical error, not a crime. I'd hate for you to build a case on a typing mistake.", emotion: "smug" },
    { character: "KULKARNI", text: "Three matching mistakes, all paying the same account, all cleared by your office. That's not a typo, Mr. Rao. That's a habit.", emotion: "suspicious" },
    { character: "NARRATOR", text: "The money runs to a shipment that no ship ever carried. Case five is closed. Next, Kulkarni goes looking for the phantom.", emotion: "neutral" },
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// LEVEL 6 — THE AUCTION HOUSE
// ────────────────────────────────────────────────────────────────────────────
const CASE_6_SCRIPT: ArcScript = {
  caseId: 6,
  arcIntro: [
    { character: "NARRATOR", text: "The auction house on the Chowk runs on Thursdays and secrets. Contraband walks in the loading door and walks out the front as 'estate antiques' with a stamped receipt and a respectable price. The catalogue is public. The bidding, Kulkarni suspects, is not.", emotion: "neutral" },
    { character: "KULKARNI", text: "A crate of smuggled goods can't be spent, Archivist. But a teak chest that 'sold' for four lakh at a licensed auction? That money's clean. The trick is the bidding — and I think it's rigged.", emotion: "suspicious" },
    { character: "ARCHIVIST", text: "One table of lots, one of bids. To pair rival bidders I'd join the bids table to itself — a self join, the same table under two names. And a UNION will stack sellers and bidders into one list.", emotion: "neutral" },
    { character: "KULKARNI", text: "Then set the bids against each other. Find the pairs who share a backer — the ones bidding with the same money. And build me a roster of everyone in that room, both sides at once.", emotion: "grave" },
  ],
  quests: [
    {
      questId: "6-q1",
      intro: [{ character: "KULKARNI", text: "Pair the rivals first. Every two bidders on the same lot, then the fight for the portrait, then the ones who share a paymaster.", emotion: "neutral" }],
      outro: [{ character: "IQBAL", text: "Three pairs bidding with the same backer's money, ma'am. They weren't competing — they were performing.", emotion: "shocked" }],
    },
    {
      questId: "6-q2",
      intro: [{ character: "KULKARNI", text: "Now the whole room. Union the sellers and the bidders, count every appearance, then label which side each name plays.", emotion: "neutral" }],
      outro: [{ character: "KULKARNI", text: "Devgarh Estate sells a cabinet and bids on a silver set the same week. A name doesn't buy from itself unless it's moving money, not goods.", emotion: "suspicious" }],
    },
    {
      questId: "6-q3",
      intro: [{ character: "KULKARNI", text: "Tie it together. Repeat sellers, their takings, the backer behind the rings, and the lot they propped up hardest.", emotion: "suspicious" }],
      outro: [
        { character: "ARCHIVIST", text: "Meridian's two shells drove lot four to twelve lakh — and lot four was consigned by V. Rao.", emotion: "shocked" },
        { character: "KULKARNI", text: "Rao supplies the lot, Meridian inflates the price, the hammer falls, and dirty money leaves as a clean cheque with Rao's cut inside it. The auction house is just a machine for laundering — and Rao's office prints the paperwork.", emotion: "grave" },
      ],
    },
  ],
  arcOutro: [
    { character: "NARRATOR", text: "Every lot, every receipt, every clearance for the goods behind them traces back to one signature at the municipal records office.", emotion: "grave" },
    { character: "VASUDEV", text: "You've been to the auctions, Inspector. A cultured hobby. I do consign the occasional heirloom — a public sale, openly recorded. Surely you're not policing my taste in furniture.", emotion: "smug" },
    { character: "KULKARNI", text: "Openly recorded by the office you run, Mr. Rao. I'm not questioning your taste. I'm questioning your inventory — and where it was before it was 'furniture'.", emotion: "suspicious" },
    { character: "NARRATOR", text: "The goods came from a shipment that customs cleared but no vessel ever carried. Case six is closed. Next, Kulkarni hunts the phantom.", emotion: "neutral" },
  ],
};

// PLACEHOLDER_SCRIPTS
const CASE_8_SCRIPT: ArcScript = {
  caseId: 8,
  arcIntro: [
    { character: "NARRATOR", text: "It began with a fire at the Purana Qila docks and a witness who vanished. Seven cases later, everything Kulkarni pulled from the ash — the courier payments, the corrupt precinct, the rigged auctions, the phantom shipments — points at one office. Tonight the Archivist opens the ledger that office thought no one would ever read.", emotion: "grave" },
    { character: "KULKARNI", text: "This is the last one, Archivist. One ledger, every laundered flow in the city, each entry stamped with the official who waved it through. I don't want a hunch. I want the query that names him and leaves no room to argue.", emotion: "grave" },
    { character: "ARCHIVIST", text: "Then I build it in layers. A common table expression — WITH — lets me total each authoriser first and query that result like a table. And window functions rank them and measure each one's share of the whole, without losing a single row.", emotion: "neutral" },
    { character: "KULKARNI", text: "Layer it as high as it takes. Rank the flows, total the players, measure their reach. When one name sits on top of all of it, we'll have our warrant.", emotion: "suspicious" },
  ],
  quests: [
    {
      questId: "8-q1",
      intro: [{ character: "KULKARNI", text: "Start with the raw flows. Rank every entry by size, run the total up over time, then rank inside each channel.", emotion: "neutral" }],
      outro: [{ character: "IQBAL", text: "₹1.43 crore through one office, ma'am — and the same name keeps topping the channels.", emotion: "shocked" }],
    },
    {
      questId: "8-q2",
      intro: [{ character: "KULKARNI", text: "Now layer it. Total what each authoriser signed, keep the big movers, then count how many channels each one reaches.", emotion: "neutral" }],
      outro: [{ character: "ARCHIVIST", text: "One authoriser in all four channels. Everyone else works one or two. It's Rao — it was always Rao.", emotion: "grave" }],
    },
    {
      questId: "8-q3",
      intro: [{ character: "KULKARNI", text: "Close it. Feed the totals into a rank, pull rank one alone, find the name in every channel, and measure his share of the whole ledger.", emotion: "suspicious" }],
      outro: [
        { character: "ARCHIVIST", text: "V. Rao. Rank one by total, the only name in all four channels, 44.2% of the entire Black Ledger.", emotion: "shocked" },
        { character: "KULKARNI", text: "Vasudev Rao. Not a clerk caught in a conspiracy — the administrator running one, from the one desk that files everyone else's paper. That's a case no lawyer walks back.", emotion: "grave" },
      ],
    },
  ],
  arcOutro: [
    { character: "NARRATOR", text: "The warrant was signed before dawn. They found V. Rao at the records office, still filing — the ledger open on his desk, as if paperwork could bury paperwork.", emotion: "grave" },
    { character: "VASUDEV", text: "You built this out of my own archives, Detective. Rows and columns. You think a court fears a spreadsheet?", emotion: "smug" },
    { character: "KULKARNI", text: "It fears the truth, Mr. Rao — and every figure in it is yours. Forty-four percent of a crore and a half, across four channels, in your hand. Salim Ansari didn't vanish for nothing. Take him away.", emotion: "grave" },
    { character: "NARRATOR", text: "From a burned witness to a signed warrant, the Archivist read the whole conspiracy out of the data one query at a time. The Black Ledger is closed. Devgarh sleeps a little safer tonight.", emotion: "neutral" },
  ],
};
const CASE_7_SCRIPT: ArcScript = {
  caseId: 7,
  arcIntro: [
    { character: "NARRATOR", text: "Customs House keeps two logs. One lists every clearance an officer signs — the paperwork that says cargo is legal and taxed. The other lists every ship that actually docks. Honest trade appears in both. Kulkarni wants the gap between them.", emotion: "neutral" },
    { character: "KULKARNI", text: "A clearance with no arrival is a shipment that never sailed, Archivist. Signed cargo, priced and stamped, aboard a vessel no harbour ever saw. That's not smuggling — that's inventing goods to move money.", emotion: "grave" },
    { character: "ARCHIVIST", text: "So I compare the clearances against the arrivals. The manifests that appear in one but not the other. A subquery inside the WHERE clause — IN and NOT IN to test membership, EXISTS and NOT EXISTS to test presence.", emotion: "neutral" },
    { character: "KULKARNI", text: "Exactly. Ask each clearance: does a real arrival back you? The ones that answer no are the phantoms. Find them, price them, and tell me whose stamp is on every one.", emotion: "suspicious" },
  ],
  quests: [
    {
      questId: "7-q1",
      intro: [{ character: "KULKARNI", text: "Read the manifests first. The high-value clearances above the average, the ones matched by a real arrival, and the ones matched by nothing.", emotion: "neutral" }],
      outro: [{ character: "IQBAL", text: "Three clearances with no arrival, ma'am — all above the average, all signed by the same hand.", emotion: "shocked" }],
    },
    {
      questId: "7-q2",
      intro: [{ character: "KULKARNI", text: "Now ask it the other way. Which clearances a real arrival backs, which it doesn't, and which arrival slipped in with no clearance at all.", emotion: "neutral" }],
      outro: [{ character: "ARCHIVIST", text: "One arrival — M-108 at Kadambari Jetty — with no clearance. And three clearances with no ship. The books don't balance.", emotion: "grave" }],
    },
    {
      questId: "7-q3",
      intro: [{ character: "KULKARNI", text: "Name the forger. Count the phantoms per officer, total their declared value, find the biggest, and list the ships that never existed.", emotion: "suspicious" }],
      outro: [
        { character: "ARCHIVIST", text: "Anil Bhatt. Every phantom clearance, ₹55 lakh across two ships that were never logged — MV Phantom and MV Ghost.", emotion: "shocked" },
        { character: "KULKARNI", text: "Bhatt — the same agent flagged in your very first case, Archivist. He forges the clearances and prices the empty air. But he's a hand, not a head. Someone pays him and buries the files.", emotion: "grave" },
      ],
    },
  ],
  arcOutro: [
    { character: "NARRATOR", text: "Anil Bhatt confessed within the hour. He named the office that fed him manifest numbers, filed his clearances, and moved his cut through the auction house.", emotion: "grave" },
    { character: "VASUDEV", text: "Bhatt is a clerk who overstepped, Inspector. If he forged documents, that's a customs matter. My office merely archives what the ports send us. We don't write it.", emotion: "smug" },
    { character: "KULKARNI", text: "Your office assigned the manifest numbers he reused, Mr. Rao. Your office sealed the files no one could pull. Every thread — the transfers, the auctions, the phantom ships — ends at your desk. One ledger left. The black one.", emotion: "grave" },
    { character: "NARRATOR", text: "Case seven is closed. The phantom fleet is grounded. All that remains is the ledger V. Rao thought no one would ever read.", emotion: "neutral" },
  ],
};

export const ALL_SCRIPTS: Record<number, ArcScript> = {
  // PLACEHOLDER_MAP
  1: CASE_1_SCRIPT,
  2: CASE_2_SCRIPT,
  3: CASE_3_SCRIPT,
  4: CASE_4_SCRIPT,
  5: CASE_5_SCRIPT,
  6: CASE_6_SCRIPT,
  7: CASE_7_SCRIPT,
  8: CASE_8_SCRIPT,
};
