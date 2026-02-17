

# SQL Noir — A Detective Game Powered by SQL

A noir-themed detective game where players solve crime cases by writing real SQL queries against a database. Each level is a new case with progressively harder SQL concepts, wrapped in compelling mystery stories.

---

## 1. Landing Page
- Dark, moody noir aesthetic with a **case-file / manila folder** visual style
- Textured paper backgrounds, typewriter fonts, coffee-stain effects
- Hero section: "SQL Noir" title with a tagline like *"Every query brings you closer to the truth"*
- Animated detective silhouette or magnifying glass
- "Enter the Precinct" CTA button leading to the levels page
- Brief intro explaining the concept: solve crimes using SQL

## 2. Levels / Case Board Page
- Styled as a **detective evidence board** with string connections
- 4 case cards displayed as pinned case files/folders
- Each card shows: case name, difficulty badge, brief teaser, and lock/unlock status
- **Linear progression**: Level 1 open, others locked with a padlock icon until prior case is solved
- Completion status shown with a "CASE CLOSED" stamp effect

## 3. Level / Case Page (Main Gameplay)
Three-panel layout styled like a detective's desk:

### Left Panel — Case Guide / Mission Briefing
- Scrollable briefing area styled as a **case notebook**
- Step-by-step objectives (e.g., "Find the suspect", "Cross-reference alibis", "Identify the weapon")
- Each step unlocks as you complete the previous one
- Hints available if stuck
- Story narrative updates as you progress through objectives

### Right Panel — Workspace (with toggle)
Two tabs toggled via buttons at the top:

**SQL Terminal**
- Dark terminal-style interface with monospace font
- Input area to write SQL queries
- Results displayed in a table below
- Query history
- Success/error feedback with detective-themed messages

**Schema Diagram**
- Visual representation of the case's database tables
- Shows table names, columns, data types, and relationships
- Styled as evidence documentation / case blueprints

## 4. The 4 Cases (Progressive SQL Difficulty)

**Case 1: "The Missing Witness"** — *Basic SELECT & WHERE*
A key witness has vanished. Query the citizen records to find them. Teaches filtering and basic selection.

**Case 2: "The Double Identity"** — *JOINs*
A con artist is using multiple identities. Cross-reference different tables to expose the fraud. Teaches inner and left joins.

**Case 3: "The Crime Ring"** — *GROUP BY & Aggregation*
A series of connected robberies. Analyze patterns by grouping crime data to find the gang's leader. Teaches COUNT, SUM, GROUP BY, HAVING.

**Case 4: "The Inside Job"** — *Subqueries & Complex Queries*
A corporate heist with an insider. Use nested queries and advanced techniques to unravel the conspiracy. Teaches subqueries, CTEs, and combining concepts.

## 5. Backend (Supabase / Lovable Cloud)
- Database tables seeded with case-specific data for each level
- An edge function to safely execute player SQL queries against read-only case data
- Player progress tracking (which levels are completed)
- Query validation to check if the player found the correct answer

## 6. Design Theme
- **Color palette**: Dark navy, warm amber/sepia, off-white paper textures
- **Typography**: Typewriter/monospace fonts for case files, clean sans-serif for UI
- **Effects**: Paper textures, stamp marks, redacted text, evidence tags, pin-board strings
- **Animations**: Subtle paper shuffling, typewriter text reveal, "CASE CLOSED" stamp animation

