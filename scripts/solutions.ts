/**
 * Canonical answer key — one verified query per objective id, shared by the
 * standalone verification harness (verify-cases.ts) and the vitest suite so the
 * two can never drift apart. Each query is proven to satisfy its objective's
 * validationFn against the real sql.js seed.
 */
import type { Database } from "sql.js";

export type Row = Record<string, unknown>;

export const CASE_SOLUTIONS: Record<string, string> = {
  // ── Level 1 — The Vanishing Witness (SELECT, WHERE) ──
  "1-1": "SELECT * FROM witnesses",
  "1-2": "SELECT * FROM witnesses WHERE full_name = 'Salim Ansari'",
  "1-3": "SELECT * FROM residents WHERE neighborhood = 'Purana Qila'",
  "1-4": "SELECT * FROM residents WHERE flagged = 1",
  "1-5": "SELECT * FROM residents WHERE occupation = 'Dockworker'",
  "1-6": "SELECT * FROM case_files WHERE district = 'Purana Qila' AND status = 'Open'",
  "1-7": "SELECT * FROM sightings WHERE location = 'Ferry Wharf'",
  "1-8": "SELECT * FROM sightings WHERE person_name = 'Salim Ansari'",
  "1-9": "SELECT * FROM residents WHERE neighborhood = 'Purana Qila' AND occupation = 'Dockworker' AND flagged = 1",
  "1-10":
    "SELECT * FROM sightings WHERE location = 'Ferry Wharf' AND sighting_date = '2024-03-12' AND sighting_time > '22:00'",

  // ── Level 2 — The Hotel on Ash Street (ORDER BY, LIMIT) ──
  "2-1": "SELECT * FROM hotel_guests ORDER BY amount_paid DESC",
  "2-2": "SELECT * FROM hotel_guests ORDER BY amount_paid DESC LIMIT 5",
  "2-3": "SELECT * FROM hotel_guests ORDER BY amount_paid DESC LIMIT 1",
  "2-4": "SELECT * FROM hotel_guests ORDER BY check_out DESC",
  "2-5": "SELECT * FROM hotel_guests ORDER BY check_in DESC LIMIT 3",
  "2-6": "SELECT * FROM room_service_orders ORDER BY price ASC LIMIT 5",
  "2-7": "SELECT * FROM hotel_guests WHERE payment_method = 'Cash' ORDER BY amount_paid DESC",
  "2-8": "SELECT * FROM cash_deposits ORDER BY amount DESC LIMIT 1",
  "2-9": "SELECT * FROM cash_deposits ORDER BY amount DESC LIMIT 3",
  "2-10":
    "SELECT * FROM hotel_guests WHERE payment_method = 'Cash' AND city_of_origin = 'Konkan Port' ORDER BY amount_paid DESC LIMIT 1",

  // ── Level 3 — The Silent Witnesses (DISTINCT, Aggregates) ──
  "3-1": "SELECT DISTINCT district FROM interview_records",
  "3-2": "SELECT DISTINCT officer FROM interview_records",
  "3-3": "SELECT COUNT(*) FROM interview_records",
  "3-4": "SELECT COUNT(*) FROM interview_records WHERE district = 'Purana Qila'",
  "3-5": "SELECT AVG(reliability_score) FROM interview_records",
  "3-6": "SELECT MAX(minutes_long) FROM interview_records",
  "3-7": "SELECT MIN(reliability_score) FROM interview_records",
  "3-8": "SELECT SUM(value_inr) FROM evidence_items",
  "3-9": "SELECT COUNT(DISTINCT category) FROM evidence_items",
  "3-10": "SELECT COUNT(*) FROM interview_records WHERE reliability_score >= 8",

  // ── Level 4 — The Corrupt Precinct (GROUP BY, HAVING) ──
  "4-1": "SELECT officer, COUNT(*) FROM seizures GROUP BY officer",
  "4-2": "SELECT district, SUM(value_inr) FROM seizures GROUP BY district",
  "4-3": "SELECT desk, COUNT(*) FROM seizures GROUP BY desk",
  "4-4": "SELECT officer, SUM(value_inr) AS total FROM seizures GROUP BY officer ORDER BY total DESC",
  "4-5": "SELECT desk, COUNT(*) FROM seizures WHERE recovered = 0 GROUP BY desk",
  "4-6": "SELECT category, AVG(value_inr) FROM seizures GROUP BY category",
  "4-7": "SELECT officer, COUNT(*) FROM seizures GROUP BY officer HAVING COUNT(*) > 4",
  "4-8":
    "SELECT desk, SUM(value_inr) AS lost FROM seizures WHERE recovered = 0 GROUP BY desk HAVING SUM(value_inr) > 1000000",
  "4-9": "SELECT officer, SUM(value_inr) AS total FROM seizures GROUP BY officer HAVING SUM(value_inr) > 200000",
  "4-10": "SELECT authorised_by, COUNT(*) FROM transfer_log GROUP BY authorised_by HAVING COUNT(*) > 5",

  // ── Level 5 — The Midnight Exchange (INNER JOIN, LEFT JOIN) ──
  "5-1": "SELECT c.courier_name, p.amount_inr FROM couriers c JOIN payments p ON c.courier_id = p.courier_id",
  "5-2":
    "SELECT c.courier_name, p.amount_inr FROM couriers c JOIN payments p ON c.courier_id = p.courier_id WHERE c.home_port = 'Konkan Port'",
  "5-3":
    "SELECT c.courier_name, SUM(p.amount_inr) FROM couriers c JOIN payments p ON c.courier_id = p.courier_id GROUP BY c.courier_name",
  "5-4": "SELECT c.courier_name, p.amount_inr FROM couriers c LEFT JOIN payments p ON c.courier_id = p.courier_id",
  "5-5":
    "SELECT c.courier_name FROM couriers c LEFT JOIN payments p ON c.courier_id = p.courier_id WHERE p.payment_id IS NULL",
  "5-6":
    "SELECT c.courier_name, COUNT(p.payment_id) FROM couriers c LEFT JOIN payments p ON c.courier_id = p.courier_id GROUP BY c.courier_name",
  "5-7": "SELECT p.* FROM payments p LEFT JOIN couriers c ON p.courier_id = c.courier_id WHERE c.courier_id IS NULL",
  "5-8":
    "SELECT SUM(p.amount_inr) FROM payments p LEFT JOIN couriers c ON p.courier_id = c.courier_id WHERE c.courier_id IS NULL",
  "5-9":
    "SELECT p.paid_by, COUNT(*) FROM payments p LEFT JOIN couriers c ON p.courier_id = c.courier_id WHERE c.courier_id IS NULL GROUP BY p.paid_by",
  "5-10":
    "SELECT c.courier_name, p.amount_inr FROM couriers c JOIN payments p ON c.courier_id = p.courier_id ORDER BY p.amount_inr DESC LIMIT 1",

  // ── Level 6 — The Auction House (SELF JOIN, UNION) ──
  "6-1": "SELECT a.bidder, b.bidder, a.lot_id FROM bids a JOIN bids b ON a.lot_id = b.lot_id AND a.bidder < b.bidder",
  "6-2":
    "SELECT a.bidder, b.bidder FROM bids a JOIN bids b ON a.lot_id = b.lot_id AND a.bidder < b.bidder WHERE a.lot_id = 4",
  "6-3":
    "SELECT a.bidder, b.bidder, a.backer FROM bids a JOIN bids b ON a.lot_id = b.lot_id AND a.backer = b.backer AND a.bidder < b.bidder",
  "6-4": "SELECT seller AS name FROM auction_lots UNION SELECT bidder FROM bids",
  "6-5": "SELECT seller FROM auction_lots UNION ALL SELECT bidder FROM bids",
  "6-6": "SELECT seller AS name, 'Seller' AS role FROM auction_lots UNION SELECT bidder, 'Bidder' FROM bids",
  "6-7": "SELECT seller, COUNT(*) FROM auction_lots GROUP BY seller HAVING COUNT(*) > 1",
  "6-8": "SELECT seller, SUM(hammer_inr) AS total FROM auction_lots GROUP BY seller ORDER BY total DESC",
  "6-9":
    "SELECT a.backer, COUNT(*) FROM bids a JOIN bids b ON a.lot_id = b.lot_id AND a.backer = b.backer AND a.bidder < b.bidder GROUP BY a.backer",
  "6-10":
    "SELECT a.bidder, b.bidder FROM bids a JOIN bids b ON a.lot_id = b.lot_id AND a.backer = b.backer AND a.bidder < b.bidder WHERE a.lot_id = 4",

  // ── Level 7 — The Phantom Shipment (Subqueries, EXISTS) ──
  "7-1":
    "SELECT * FROM clearances WHERE declared_value_inr > (SELECT AVG(declared_value_inr) FROM clearances)",
  "7-2":
    "SELECT * FROM clearances WHERE manifest_ref IN (SELECT manifest_ref FROM arrivals)",
  "7-3":
    "SELECT * FROM clearances WHERE manifest_ref NOT IN (SELECT manifest_ref FROM arrivals)",
  "7-4":
    "SELECT * FROM clearances c WHERE EXISTS (SELECT 1 FROM arrivals a WHERE a.manifest_ref = c.manifest_ref)",
  "7-5":
    "SELECT * FROM clearances c WHERE NOT EXISTS (SELECT 1 FROM arrivals a WHERE a.manifest_ref = c.manifest_ref)",
  "7-6":
    "SELECT * FROM arrivals a WHERE NOT EXISTS (SELECT 1 FROM clearances c WHERE c.manifest_ref = a.manifest_ref)",
  "7-7":
    "SELECT cleared_by, COUNT(*) FROM clearances WHERE manifest_ref NOT IN (SELECT manifest_ref FROM arrivals) GROUP BY cleared_by",
  "7-8":
    "SELECT SUM(declared_value_inr) FROM clearances WHERE manifest_ref NOT IN (SELECT manifest_ref FROM arrivals)",
  "7-9":
    "SELECT * FROM clearances WHERE manifest_ref NOT IN (SELECT manifest_ref FROM arrivals) ORDER BY declared_value_inr DESC LIMIT 1",
  "7-10":
    "SELECT DISTINCT vessel FROM clearances WHERE vessel NOT IN (SELECT vessel FROM arrivals)",

  // ── Level 8 — The Black Ledger (CTEs, Window Functions) ──
  "8-1":
    "SELECT authorised_by, amount_inr, RANK() OVER (ORDER BY amount_inr DESC) AS rnk FROM ledger_entries ORDER BY rnk",
  "8-2":
    "SELECT entry_date, amount_inr, SUM(amount_inr) OVER (ORDER BY entry_date, entry_id) AS running FROM ledger_entries ORDER BY entry_date, entry_id",
  "8-3":
    "SELECT channel, authorised_by, amount_inr, RANK() OVER (PARTITION BY channel ORDER BY amount_inr DESC) AS rnk FROM ledger_entries ORDER BY channel, rnk",
  "8-4":
    "WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT * FROM totals ORDER BY total DESC",
  "8-5":
    "WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT * FROM totals WHERE total > 2000000 ORDER BY total DESC",
  "8-6":
    "WITH reach AS (SELECT authorised_by, COUNT(DISTINCT channel) AS channels FROM ledger_entries GROUP BY authorised_by) SELECT * FROM reach ORDER BY channels DESC",
  "8-7":
    "WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT authorised_by, total, RANK() OVER (ORDER BY total DESC) AS rnk FROM totals ORDER BY rnk",
  "8-8":
    "WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by), ranked AS (SELECT authorised_by, total, RANK() OVER (ORDER BY total DESC) AS rnk FROM totals) SELECT * FROM ranked WHERE rnk = 1",
  "8-9":
    "WITH reach AS (SELECT authorised_by, COUNT(DISTINCT channel) AS channels, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT * FROM reach WHERE channels = 4",
  "8-10":
    "WITH totals AS (SELECT authorised_by, SUM(amount_inr) AS total FROM ledger_entries GROUP BY authorised_by) SELECT authorised_by, total, ROUND(total * 100.0 / SUM(total) OVER (), 1) AS pct FROM totals ORDER BY total DESC",
};

/** Run a query and shape sql.js's column/value output into plain row objects. */
export function toRows(db: Database, sql: string): Row[] {
  const res = db.exec(sql);
  if (res.length === 0) return [];
  const { columns, values } = res[res.length - 1];
  return values.map((v) => {
    const row: Row = {};
    columns.forEach((c, i) => (row[c] = v[i]));
    return row;
  });
}
