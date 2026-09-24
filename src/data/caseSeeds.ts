/**
 * Case database seeds — real SQLite CREATE TABLE + INSERT statements, run by sql.js.
 *
 * THE BLACK LEDGER CONSPIRACY — Devgarh, an Indian metropolis.
 * Eight cumulative levels; each level's dataset is large enough that answers
 * cannot be guessed. Dates are ISO (YYYY-MM-DD); times are 24h TEXT; money is INR.
 *
 * Levels 1–3 are authored in full and verified against sql.js.
 * Levels 4–8 ship as marked "In Development" placeholders (sequential unlock
 * means players cannot reach them until Level 3 is complete).
 */
export const CASE_SEEDS: Record<number, string> = {

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 1 — THE VANISHING WITNESS  (Devgarh · Purana Qila quarter)
// Concepts: SELECT, WHERE
// ═══════════════════════════════════════════════════════════════════════════
1: `
CREATE TABLE witnesses (
  witness_id INTEGER PRIMARY KEY,
  full_name TEXT,
  neighborhood TEXT,
  age INTEGER,
  statement_summary TEXT,
  contact_status TEXT,
  last_seen_date TEXT
);
INSERT INTO witnesses VALUES
(1,'Salim Ansari','Purana Qila',34,'Saw two men load crates onto a launch at the wharf after the fire','Missing','2024-03-12'),
(2,'Rukhsana Bano','Purana Qila',41,'Heard shouting near the timber godown around midnight','Reachable','2024-03-18'),
(3,'Devendra Joshi','Civil Lines',52,'Reported smoke rising over the Old Fort docks','Reachable','2024-03-19'),
(4,'Marya Pinto','Kadambari',29,'Noticed a black sedan parked with no plates','Reachable','2024-03-17'),
(5,'Iqbal Shaikh','Purana Qila',38,'Delivered chai to dockworkers that night','Unreachable','2024-03-14'),
(6,'Nalini Rao','Raj Nagar',47,'Saw a man running toward the ferry ramp','Reachable','2024-03-16'),
(7,'Prakash Naik','Purana Qila',60,'Night watchman; logged an unscheduled launch','Missing','2024-03-13'),
(8,'Farida Kazi','Nizam Colony',33,'Overheard a phone call about a manifest','Reachable','2024-03-18'),
(9,'Sunil Gaikwad','Kadambari',44,'Ferry operator; refused to comment','Unreachable','2024-03-15'),
(10,'Anwar Sheikh','Purana Qila',27,'Loading-crew casual; left town abruptly','Unreachable','2024-03-14'),
(11,'Vimla Desai','Civil Lines',55,'Saw crates marked with a crescent stencil','Reachable','2024-03-19'),
(12,'Rehan Mistry','Raj Nagar',31,'Photographed the launch but the photos are gone','Reachable','2024-03-17');

CREATE TABLE residents (
  resident_id INTEGER PRIMARY KEY,
  full_name TEXT,
  neighborhood TEXT,
  occupation TEXT,
  phone TEXT,
  flagged INTEGER
);
INSERT INTO residents VALUES
(1001,'Farhan Qureshi','Purana Qila','Dockworker','+91-98200-14411',1),
(1002,'Salim Ansari','Purana Qila','Dockworker','+91-98200-77120',0),
(1003,'Rukhsana Bano','Purana Qila','Tailor','+91-98200-33418',0),
(1004,'Prakash Naik','Purana Qila','Watchman','+91-98200-55190',0),
(1005,'Anwar Sheikh','Purana Qila','Dockworker','+91-98200-90233',0),
(1006,'Iqbal Shaikh','Purana Qila','Tea vendor','+91-98200-11002',0),
(1007,'Zoya Merchant','Purana Qila','Clerk','+91-98200-64457',0),
(1008,'Bhaskar Pawar','Purana Qila','Dockworker','+91-98200-72381',1),
(1009,'Meena Kulkarni','Purana Qila','Nurse','+91-98200-48810',0),
(1010,'Devendra Joshi','Civil Lines','Accountant','+91-98200-20017',0),
(1011,'Vimla Desai','Civil Lines','Retired teacher','+91-98200-39944',0),
(1012,'Anil Bhatt','Civil Lines','Customs agent','+91-98200-85562',1),
(1013,'Rekha Nair','Civil Lines','Journalist','+91-98200-70019',0),
(1014,'Sunil Gaikwad','Kadambari','Ferry operator','+91-98200-15578',1),
(1015,'Marya Pinto','Kadambari','Photographer','+91-98200-42230',0),
(1016,'Rehan Mistry','Raj Nagar','Photographer','+91-98200-61144',0),
(1017,'Nalini Rao','Raj Nagar','Shopkeeper','+91-98200-30026',0),
(1018,'Yusuf Dalvi','Raj Nagar','Dockworker','+91-98200-58890',0),
(1019,'Farida Kazi','Nizam Colony','Telephone operator','+91-98200-24413',0),
(1020,'Kabir Shah','Nizam Colony','Warehouse manager','+91-98200-93307',1),
(1021,'Latika Sen','Nizam Colony','Bank teller','+91-98200-10098',0),
(1022,'Ramesh Tandel','Purana Qila','Dockworker','+91-98200-67742',0),
(1023,'Sana Merchant','Kadambari','Student','+91-98200-88121',0),
(1024,'Ganesh More','Raj Nagar','Truck driver','+91-98200-49963',0);

CREATE TABLE case_files (
  file_id INTEGER PRIMARY KEY,
  title TEXT,
  district TEXT,
  status TEXT,
  opened_date TEXT,
  lead_officer TEXT
);
INSERT INTO case_files VALUES
(5001,'Warehouse Fire at Old Fort Docks','Purana Qila','Open','2024-03-12','DI Rhea Kulkarni'),
(5002,'Missing Person: Salim Ansari','Purana Qila','Open','2024-03-15','DI Rhea Kulkarni'),
(5003,'Pilferage at Timber Godown','Purana Qila','Closed','2023-11-02','SI Arjun Deshpande'),
(5004,'Ferry License Dispute','Kadambari','Open','2024-02-20','SI Arjun Deshpande'),
(5005,'Customs Manifest Irregularity','Civil Lines','Cold','2023-09-14','DI Rhea Kulkarni'),
(5006,'Vandalism at Fish Market','Raj Nagar','Closed','2024-01-08','SI Neha Bhonsle'),
(5007,'Unlicensed Launch Operation','Purana Qila','Cold','2023-12-30','SI Neha Bhonsle'),
(5008,'Bank Fraud Complaint','Nizam Colony','Open','2024-03-01','DI Rhea Kulkarni');

CREATE TABLE sightings (
  sighting_id INTEGER PRIMARY KEY,
  person_name TEXT,
  location TEXT,
  sighting_date TEXT,
  sighting_time TEXT,
  reported_by TEXT
);
INSERT INTO sightings VALUES
(9001,'Salim Ansari','Ferry Wharf','2024-03-11','21:30','Prakash Naik'),
(9002,'Salim Ansari','Timber Godown','2024-03-12','23:10','Rukhsana Bano'),
(9003,'Salim Ansari','Old Fort Gate','2024-03-12','20:05','Iqbal Shaikh'),
(9004,'Farhan Qureshi','Ferry Wharf','2024-03-12','22:40','Prakash Naik'),
(9005,'Farhan Qureshi','Timber Godown','2024-03-12','23:30','Anwar Sheikh'),
(9006,'Bhaskar Pawar','Ferry Wharf','2024-03-10','18:00','Sunil Gaikwad'),
(9007,'Kabir Shah','Fish Market','2024-03-12','09:15','Rekha Nair'),
(9008,'Anil Bhatt','Old Fort Gate','2024-03-12','22:50','Nalini Rao'),
(9009,'Sunil Gaikwad','Ferry Ramp','2024-03-12','23:55','Rehan Mistry'),
(9010,'Farhan Qureshi','Chai Stall','2024-03-12','19:20','Iqbal Shaikh'),
(9011,'Rukhsana Bano','Ferry Wharf','2024-03-13','07:30','Marya Pinto'),
(9012,'Prakash Naik','Timber Godown','2024-03-12','23:45','Anwar Sheikh'),
(9013,'Yusuf Dalvi','Fish Market','2024-03-11','10:00','Nalini Rao'),
(9014,'Kabir Shah','Ferry Wharf','2024-03-12','15:10','Rekha Nair'),
(9015,'Anwar Sheikh','Old Fort Gate','2024-03-14','06:00','Vimla Desai'),
(9016,'Ganesh More','Fish Market','2024-03-12','12:00','Marya Pinto'),
(9017,'Farhan Qureshi','Old Fort Gate','2024-03-13','22:10','Prakash Naik'),
(9018,'Ramesh Tandel','Timber Godown','2024-03-12','21:00','Iqbal Shaikh'),
(9019,'Sunil Gaikwad','Ferry Wharf','2024-03-09','17:45','Rehan Mistry'),
(9020,'Nalini Rao','Fish Market','2024-03-16','11:20','Marya Pinto');
`,

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 2 — THE HOTEL ON ASH STREET  (Devgarh · Grand Meridian, near the Junction)
// Concepts: ORDER BY, LIMIT  (cumulative with SELECT, WHERE)
// ═══════════════════════════════════════════════════════════════════════════
2: `
CREATE TABLE hotel_guests (
  guest_id INTEGER PRIMARY KEY,
  full_name TEXT,
  room_number INTEGER,
  check_in TEXT,
  check_out TEXT,
  amount_paid INTEGER,
  payment_method TEXT,
  city_of_origin TEXT
);
INSERT INTO hotel_guests VALUES
(1,'Meridian Holdings Rep',701,'2024-03-09','2024-03-13',420000,'Card','Devgarh'),
(2,'Imtiaz Sayed',512,'2024-03-11','2024-03-13',285000,'Cash','Konkan Port'),
(3,'Nadia Shroff',305,'2024-03-10','2024-03-12',178000,'Cash','Devgarh'),
(4,'Rajesh Khanna',210,'2024-03-08','2024-03-11',96000,'Card','Pune'),
(5,'Farhan Qureshi',118,'2024-03-12','2024-03-13',12000,'Cash','Devgarh'),
(6,'Aruna Kelkar',402,'2024-03-07','2024-03-10',64000,'UPI','Nagpur'),
(7,'Vikram Sethi',508,'2024-03-11','2024-03-14',152000,'Bank Transfer','Devgarh'),
(8,'Priya Menon',220,'2024-03-09','2024-03-12',38000,'Card','Kochi'),
(9,'Sameer Bagchi',610,'2024-03-10','2024-03-15',205000,'Cash','Kolkata'),
(10,'Deepa Iyer',130,'2024-03-06','2024-03-08',21000,'UPI','Chennai'),
(11,'Harish Malhotra',715,'2024-03-12','2024-03-16',168000,'Card','Delhi'),
(12,'Tara Fernandes',318,'2024-03-08','2024-03-10',45000,'Cash','Goa'),
(13,'Kabir Shah',505,'2024-03-11','2024-03-13',88000,'Cash','Devgarh'),
(14,'Nisha Rao',240,'2024-03-07','2024-03-09',30000,'UPI','Devgarh'),
(15,'Ovais Khan',620,'2024-03-10','2024-03-14',134000,'Bank Transfer','Devgarh'),
(16,'Latika Sen',150,'2024-03-09','2024-03-11',27000,'Card','Devgarh'),
(17,'Manish Doshi',410,'2024-03-12','2024-03-17',192000,'Cash','Surat'),
(18,'Gopal Verma',260,'2024-03-06','2024-03-07',15000,'UPI','Devgarh'),
(19,'Sana Merchant',330,'2024-03-10','2024-03-12',52000,'Card','Devgarh'),
(20,'Ravi Teja',640,'2024-03-11','2024-03-13',240000,'Cash','Konkan Port');

CREATE TABLE room_service_orders (
  order_id INTEGER PRIMARY KEY,
  room_number INTEGER,
  item TEXT,
  quantity INTEGER,
  price INTEGER,
  order_time TEXT
);
INSERT INTO room_service_orders VALUES
(3001,512,'Club sandwich',2,650,'2024-03-11 22:15'),
(3002,512,'Whisky, single malt',4,4800,'2024-03-11 23:40'),
(3003,305,'Masala chai',1,120,'2024-03-10 07:05'),
(3004,701,'Continental breakfast',3,1350,'2024-03-10 08:30'),
(3005,610,'Biryani platter',2,1600,'2024-03-12 13:20'),
(3006,118,'Cutting chai',1,40,'2024-03-12 06:10'),
(3007,410,'Fresh lime soda',2,180,'2024-03-13 16:00'),
(3008,508,'Grilled pomfret',1,1200,'2024-03-12 20:45'),
(3009,640,'Whisky, single malt',6,7200,'2024-03-11 23:55'),
(3010,220,'Filter coffee',1,90,'2024-03-10 09:10'),
(3011,715,'Butter chicken',2,1400,'2024-03-13 21:30'),
(3012,402,'Vegetable thali',1,520,'2024-03-08 13:00'),
(3013,305,'Bottled water',6,300,'2024-03-11 10:00'),
(3014,505,'Kingfisher lager',4,1600,'2024-03-12 22:05'),
(3015,130,'Toast and eggs',1,220,'2024-03-07 08:00');

CREATE TABLE cash_deposits (
  deposit_id INTEGER PRIMARY KEY,
  depositor_name TEXT,
  amount INTEGER,
  deposit_date TEXT,
  bank_branch TEXT
);
INSERT INTO cash_deposits VALUES
(4001,'Imtiaz Sayed',900000,'2024-03-14','Devgarh Junction Branch'),
(4002,'Ravi Teja',640000,'2024-03-14','Devgarh Junction Branch'),
(4003,'Nadia Shroff',450000,'2024-03-13','Ash Street Branch'),
(4004,'Sameer Bagchi',520000,'2024-03-16','Kolkata Central'),
(4005,'Meridian Holdings',780000,'2024-03-15','Civil Lines Branch'),
(4006,'Manish Doshi',300000,'2024-03-18','Surat Ring Road'),
(4007,'Kabir Shah',210000,'2024-03-14','Ash Street Branch'),
(4008,'Nadia Shroff',180000,'2024-03-17','Ash Street Branch'),
(4009,'Vikram Sethi',95000,'2024-03-15','Civil Lines Branch'),
(4010,'Imtiaz Sayed',260000,'2024-03-19','Devgarh Junction Branch'),
(4011,'Tara Fernandes',60000,'2024-03-11','Goa Panjim'),
(4012,'Ravi Teja',150000,'2024-03-20','Devgarh Junction Branch');
`,

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 3 — THE SILENT WITNESSES  (Devgarh · scattered district interviews)
// Concepts: DISTINCT, Aggregates (COUNT/SUM/AVG/MIN/MAX)  (cumulative)
// ═══════════════════════════════════════════════════════════════════════════
3: `
CREATE TABLE interview_records (
  interview_id INTEGER PRIMARY KEY,
  witness_name TEXT,
  district TEXT,
  officer TEXT,
  statement_date TEXT,
  reliability_score INTEGER,
  minutes_long INTEGER
);
INSERT INTO interview_records VALUES
(1,'Rukhsana Bano','Purana Qila','SI Arjun Deshpande','2024-03-18',9,42),
(2,'Prakash Naik','Purana Qila','DI Rhea Kulkarni','2024-03-13',8,55),
(3,'Iqbal Shaikh','Purana Qila','Constable Iqbal Khan','2024-03-14',5,20),
(4,'Anwar Sheikh','Purana Qila','SI Arjun Deshpande','2024-03-14',4,18),
(5,'Ramesh Tandel','Purana Qila','SI Neha Bhonsle','2024-03-15',6,30),
(6,'Zoya Merchant','Purana Qila','DI Rhea Kulkarni','2024-03-16',7,25),
(7,'Devendra Joshi','Civil Lines','DI Rhea Kulkarni','2024-03-19',8,48),
(8,'Vimla Desai','Civil Lines','SI Neha Bhonsle','2024-03-19',9,60),
(9,'Anil Bhatt','Civil Lines','SI Arjun Deshpande','2024-03-17',3,15),
(10,'Rekha Nair','Civil Lines','DI Rhea Kulkarni','2024-03-20',10,72),
(11,'Marya Pinto','Kadambari','SI Neha Bhonsle','2024-03-17',7,35),
(12,'Sunil Gaikwad','Kadambari','SI Arjun Deshpande','2024-03-15',2,12),
(13,'Sana Merchant','Kadambari','Constable Iqbal Khan','2024-03-18',6,28),
(14,'Nalini Rao','Raj Nagar','SI Neha Bhonsle','2024-03-16',7,33),
(15,'Rehan Mistry','Raj Nagar','DI Rhea Kulkarni','2024-03-17',8,50),
(16,'Yusuf Dalvi','Raj Nagar','SI Arjun Deshpande','2024-03-18',5,22),
(17,'Ganesh More','Raj Nagar','Constable Iqbal Khan','2024-03-16',4,16),
(18,'Farida Kazi','Nizam Colony','DI Rhea Kulkarni','2024-03-18',9,45),
(19,'Kabir Shah','Nizam Colony','SI Arjun Deshpande','2024-03-14',3,19),
(20,'Latika Sen','Nizam Colony','SI Neha Bhonsle','2024-03-19',6,26),
(21,'Imtiaz Sayed','Konkan Gate','DI Rhea Kulkarni','2024-03-20',2,10),
(22,'Ravi Teja','Konkan Gate','SI Arjun Deshpande','2024-03-20',1,8),
(23,'Nadia Shroff','Konkan Gate','SI Neha Bhonsle','2024-03-19',3,14),
(24,'Harish Malhotra','Konkan Gate','DI Rhea Kulkarni','2024-03-21',8,40);

CREATE TABLE evidence_items (
  item_id INTEGER PRIMARY KEY,
  description TEXT,
  district TEXT,
  category TEXT,
  value_inr INTEGER,
  recovered INTEGER
);
INSERT INTO evidence_items VALUES
(1,'Charred shipping manifest','Purana Qila','Document',0,1),
(2,'Kerosene cans (empty)','Purana Qila','Contraband',5000,1),
(3,'Launch fuel receipt','Purana Qila','Document',0,1),
(4,'Cash bundle, partial','Ash Street','Cash',285000,0),
(5,'Ledger fragment','Civil Lines','Document',0,1),
(6,'Countersign stamp','Civil Lines','Document',12000,0),
(7,'Crate with crescent stencil','Konkan Gate','Contraband',450000,0),
(8,'Second crate, sealed','Konkan Gate','Contraband',450000,0),
(9,'Country-made pistol','Raj Nagar','Weapon',35000,1),
(10,'Ammunition box','Raj Nagar','Weapon',18000,1),
(11,'Black sedan, no plates','Kadambari','Vehicle',600000,0),
(12,'Ferry launch (impounded)','Purana Qila','Vehicle',900000,1),
(13,'Bribe envelope','Nizam Colony','Cash',150000,0),
(14,'Forged customs seal','Konkan Gate','Document',8000,0),
(15,'Cash bundle, taped','Ash Street','Cash',640000,0),
(16,'Import invoice (Meridian)','Civil Lines','Document',0,1);
`,

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 4 — THE CORRUPT PRECINCT  (Devgarh · Precinct 47 property room)
// Concepts: GROUP BY, HAVING  (cumulative)
// ═══════════════════════════════════════════════════════════════════════════
4: `
CREATE TABLE seizures (
  seizure_id INTEGER PRIMARY KEY,
  officer TEXT,
  desk TEXT,
  district TEXT,
  category TEXT,
  value_inr INTEGER,
  recovered INTEGER,
  seized_date TEXT
);
INSERT INTO seizures VALUES
(1,'ASI Dev Salunke','Central Store','Konkan Gate','Contraband',450000,0,'2024-03-13'),
(2,'ASI Dev Salunke','Central Store','Konkan Gate','Cash',640000,0,'2024-03-14'),
(3,'ASI Dev Salunke','Central Store','Purana Qila','Contraband',300000,0,'2024-03-15'),
(4,'ASI Dev Salunke','Central Store','Civil Lines','Document',12000,0,'2024-03-16'),
(5,'ASI Dev Salunke','Central Store','Nizam Colony','Cash',150000,0,'2024-03-17'),
(6,'ASI Dev Salunke','Central Store','Kadambari','Vehicle',600000,0,'2024-03-18'),
(7,'SI Arjun Deshpande','Dockside Store','Purana Qila','Weapon',35000,1,'2024-03-12'),
(8,'SI Arjun Deshpande','Dockside Store','Purana Qila','Weapon',18000,1,'2024-03-12'),
(9,'SI Arjun Deshpande','Dockside Store','Raj Nagar','Vehicle',900000,1,'2024-03-13'),
(10,'SI Arjun Deshpande','Dockside Store','Purana Qila','Document',0,1,'2024-03-13'),
(11,'SI Neha Bhonsle','North Annexe','Raj Nagar','Contraband',5000,1,'2024-03-14'),
(12,'SI Neha Bhonsle','North Annexe','Civil Lines','Document',8000,1,'2024-03-15'),
(13,'SI Neha Bhonsle','North Annexe','Nizam Colony','Cash',60000,1,'2024-03-16'),
(14,'SI Neha Bhonsle','North Annexe','Kadambari','Document',0,1,'2024-03-16'),
(15,'Constable Iqbal Khan','Dockside Store','Purana Qila','Document',0,1,'2024-03-12'),
(16,'Constable Iqbal Khan','Dockside Store','Purana Qila','Contraband',5000,1,'2024-03-13'),
(17,'SI Rakesh Gokhale','Central Store','Konkan Gate','Cash',210000,0,'2024-03-17'),
(18,'SI Rakesh Gokhale','Central Store','Civil Lines','Document',0,1,'2024-03-18'),
(19,'SI Rakesh Gokhale','North Annexe','Raj Nagar','Weapon',25000,0,'2024-03-19');

CREATE TABLE transfer_log (
  transfer_id INTEGER PRIMARY KEY,
  item_ref TEXT,
  from_desk TEXT,
  to_office TEXT,
  authorised_by TEXT,
  transfer_date TEXT
);
INSERT INTO transfer_log VALUES
(6001,'Contraband crate','Central Store','Municipal Records Office','V. Rao','2024-03-14'),
(6002,'Cash bundle','Central Store','Municipal Records Office','V. Rao','2024-03-15'),
(6003,'Second contraband crate','Central Store','Municipal Records Office','V. Rao','2024-03-16'),
(6004,'Countersign stamp','Central Store','Municipal Records Office','V. Rao','2024-03-17'),
(6005,'Bribe envelope','Central Store','Municipal Records Office','V. Rao','2024-03-18'),
(6006,'Impounded sedan','Central Store','Municipal Records Office','V. Rao','2024-03-19'),
(6007,'Cash bundle, taped','Central Store','Municipal Records Office','V. Rao','2024-03-18'),
(6008,'Country-made pistol','Dockside Store','Precinct 47 Armoury','SI Arjun Deshpande','2024-03-13'),
(6009,'Ammunition box','Dockside Store','Precinct 47 Armoury','SI Arjun Deshpande','2024-03-13'),
(6010,'Ferry launch','Dockside Store','Impound Yard','SI Arjun Deshpande','2024-03-14'),
(6011,'Kerosene cans','North Annexe','Forensics','SI Neha Bhonsle','2024-03-15'),
(6012,'Ledger fragment','North Annexe','Forensics','SI Neha Bhonsle','2024-03-16');
`,

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 5 — THE MIDNIGHT EXCHANGE  (Devgarh · the courier–payment ledgers)
// Concepts: INNER JOIN, LEFT JOIN  (cumulative)
// ═══════════════════════════════════════════════════════════════════════════
5: `
CREATE TABLE couriers (
  courier_id INTEGER PRIMARY KEY,
  courier_name TEXT,
  home_port TEXT,
  handler TEXT,
  active INTEGER
);
INSERT INTO couriers VALUES
(1,'Imtiaz Sayed','Konkan Port','Meridian Holdings',1),
(2,'Ravi Teja','Konkan Port','Meridian Holdings',1),
(3,'Farhan Qureshi','Devgarh','Kabir Shah',1),
(4,'Anwar Sheikh','Devgarh','Kabir Shah',0),
(5,'Nadia Shroff','Devgarh','Meridian Holdings',1),
(6,'Sunil Gaikwad','Kadambari','Kabir Shah',1),
(7,'Yusuf Dalvi','Devgarh','Kabir Shah',1),
(8,'Manish Doshi','Surat','Meridian Holdings',1);

CREATE TABLE payments (
  payment_id INTEGER PRIMARY KEY,
  courier_id INTEGER,
  amount_inr INTEGER,
  pay_date TEXT,
  paid_by TEXT,
  channel TEXT
);
INSERT INTO payments VALUES
(9001,1,900000,'2024-03-14','Meridian Holdings','Cash'),
(9002,1,260000,'2024-03-19','Meridian Holdings','Cash'),
(9003,2,640000,'2024-03-14','Meridian Holdings','Cash'),
(9004,2,150000,'2024-03-20','Meridian Holdings','Bank Transfer'),
(9005,3,120000,'2024-03-13','Kabir Shah','Cash'),
(9006,5,450000,'2024-03-13','Meridian Holdings','Cash'),
(9007,5,180000,'2024-03-17','Meridian Holdings','Cash'),
(9008,6,95000,'2024-03-15','Kabir Shah','UPI'),
(9009,8,300000,'2024-03-18','Meridian Holdings','Cash'),
(9010,99,520000,'2024-03-16','Meridian Holdings','Bank Transfer'),
(9011,99,410000,'2024-03-18','Meridian Holdings','Bank Transfer'),
(9012,NULL,780000,'2024-03-15','Meridian Holdings','Bank Transfer');
`,

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 6 — THE AUCTION HOUSE  (Devgarh · the Chowk auction rooms)
// Concepts: SELF JOIN, UNION  (cumulative)
// ═══════════════════════════════════════════════════════════════════════════
6: `
CREATE TABLE auction_lots (
  lot_id INTEGER PRIMARY KEY,
  title TEXT,
  seller TEXT,
  hammer_inr INTEGER,
  sale_date TEXT,
  category TEXT
);
INSERT INTO auction_lots VALUES
(1,'Colonial teak chest','V. Rao',450000,'2024-04-02','Antique'),
(2,'Silver ceremonial set','Meridian Holdings',780000,'2024-04-02','Antique'),
(3,'Brass ship instruments','Kabir Shah',210000,'2024-04-03','Maritime'),
(4,'Portrait, unsigned','V. Rao',1200000,'2024-04-03','Art'),
(5,'Jade seal','Meridian Holdings',640000,'2024-04-04','Antique'),
(6,'Ledger cabinet','Devgarh Estate',95000,'2024-04-04','Furniture');

CREATE TABLE bids (
  bid_id INTEGER PRIMARY KEY,
  lot_id INTEGER,
  bidder TEXT,
  backer TEXT,
  bid_amount INTEGER
);
INSERT INTO bids VALUES
(1,1,'Salim Traders','Kabir Shah',350000),
(2,1,'Coastal Imports','Kabir Shah',450000),
(3,2,'Arun Sethi','Meridian Holdings',600000),
(4,2,'Priya Naik','Meridian Holdings',700000),
(5,2,'Devgarh Estate','Independent',780000),
(6,4,'Deepak Rao','Meridian Holdings',900000),
(7,4,'Ovais Khan','Meridian Holdings',1100000),
(8,4,'Tara Fernandes','Independent',1200000),
(9,5,'Salim Traders','Kabir Shah',500000),
(10,5,'Nadia Shroff','Meridian Holdings',640000),
(11,3,'Independent Buyer','Independent',210000),
(12,6,'Local Dealer','Independent',95000);
`,

// ═══════════════════════════════════════════════════════════════════════════
// LEVEL 7 — THE PHANTOM SHIPMENT  (Devgarh · customs house, Konkan Port)
// Concepts: Subqueries, EXISTS  (cumulative)
// ═══════════════════════════════════════════════════════════════════════════
7: `
CREATE TABLE clearances (
  clearance_id INTEGER PRIMARY KEY,
  manifest_ref TEXT,
  cleared_by TEXT,
  clearance_date TEXT,
  declared_value_inr INTEGER,
  vessel TEXT
);
INSERT INTO clearances VALUES
(1,'M-101','S. Kamat','2024-04-10',450000,'MV Konkan Star'),
(2,'M-102','S. Kamat','2024-04-11',380000,'MV Konkan Star'),
(3,'M-103','R. Fernandes','2024-04-12',520000,'MV Sea Pearl'),
(4,'M-104','R. Fernandes','2024-04-12',290000,'MV Sea Pearl'),
(5,'M-105','S. Kamat','2024-04-14',610000,'MV Blue Heron'),
(6,'M-106','P. Iyer','2024-04-15',340000,'MV Blue Heron'),
(7,'M-107','R. Fernandes','2024-04-16',480000,'MV Sea Pearl'),
(8,'M-201','Anil Bhatt','2024-04-13',1500000,'MV Phantom'),
(9,'M-202','Anil Bhatt','2024-04-14',1800000,'MV Phantom'),
(10,'M-203','Anil Bhatt','2024-04-17',2200000,'MV Ghost'),
(11,'M-101','Anil Bhatt','2024-04-18',900000,'MV Konkan Star');

CREATE TABLE arrivals (
  arrival_id INTEGER PRIMARY KEY,
  manifest_ref TEXT,
  dock TEXT,
  arrival_date TEXT,
  vessel TEXT
);
INSERT INTO arrivals VALUES
(1,'M-101','Konkan Port','2024-04-10','MV Konkan Star'),
(2,'M-102','Old Fort Docks','2024-04-11','MV Konkan Star'),
(3,'M-103','Konkan Port','2024-04-12','MV Sea Pearl'),
(4,'M-104','Kadambari Jetty','2024-04-12','MV Sea Pearl'),
(5,'M-105','Konkan Port','2024-04-14','MV Blue Heron'),
(6,'M-106','Old Fort Docks','2024-04-15','MV Blue Heron'),
(7,'M-107','Konkan Port','2024-04-16','MV Sea Pearl'),
(8,'M-108','Kadambari Jetty','2024-04-17','MV Sea Pearl');
`,

  // ═══════════════════════════════════════════════════════════════════════════
  // LEVEL 8 — THE BLACK LEDGER  (Devgarh · municipal records office)
  // Concepts: CTEs, Window Functions  (cumulative — the finale)
  // ═══════════════════════════════════════════════════════════════════════════
  8: `
CREATE TABLE ledger_entries (
  entry_id INTEGER PRIMARY KEY,
  entry_date TEXT,
  channel TEXT,
  authorised_by TEXT,
  amount_inr INTEGER,
  counterparty TEXT
);
INSERT INTO ledger_entries VALUES
(1,'2024-03-15','Transfer','V. Rao',2000000,'Meridian Holdings'),
(2,'2024-03-20','Courier','Meridian Holdings',1200000,'Imtiaz Sayed'),
(3,'2024-03-28','Courier','Kabir Shah',800000,'Farhan Qureshi'),
(4,'2024-04-02','Auction','V. Rao',1650000,'Meridian Holdings'),
(5,'2024-04-05','Auction','Meridian Holdings',780000,'Devgarh Estate'),
(6,'2024-04-08','Auction','Kabir Shah',640000,'Nadia Shroff'),
(7,'2024-04-10','Customs','S. Kamat',610000,'Konkan Traders'),
(8,'2024-04-13','Customs','Anil Bhatt',1500000,'MV Phantom'),
(9,'2024-04-14','Customs','Anil Bhatt',2200000,'MV Ghost'),
(10,'2024-04-16','Courier','V. Rao',900000,'Yusuf Dalvi'),
(11,'2024-04-18','Customs','V. Rao',1800000,'MV Konkan Star'),
(12,'2024-04-20','Courier','Nadia Shroff',300000,'Meridian Holdings');
`,
};
