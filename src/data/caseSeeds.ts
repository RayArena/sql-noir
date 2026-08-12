/**
 * Case database seeds — real CREATE TABLE + INSERT statements.
 * Databases are intentionally large so players cannot guess answers.
 * Each case has hundreds of rows spread across multiple tables.
 */
export const CASE_SEEDS: Record<number, string> = {

// ═══════════════════════════════════════════════════════════════════════════
// CASE 1 — THE ROYAL RUBY (Calcutta 1946)
// ═══════════════════════════════════════════════════════════════════════════
1: `
CREATE TABLE police_fir_logs (
  fir_id INTEGER PRIMARY KEY,
  location TEXT, incident_type TEXT,
  reported_time TEXT, officer_in_charge TEXT
);
INSERT INTO police_fir_logs VALUES
(101,'Sovabazar Rajbari','Theft / Blackout','20:15:00','Inspector Das'),
(102,'Burrabazar Market','Pickpocketing','14:30:00','Sub-Inspector Roy'),
(103,'Hatibagan Lane 4','Assault','22:45:00','Inspector Das'),
(104,'Shyambazar Crossing','Vandalism','09:00:00','Sub-Inspector Mitra'),
(105,'Dum Dum Junction','Robbery','11:20:00','Inspector Das'),
(106,'Gariahat Bazaar','Pickpocketing','16:00:00','Sub-Inspector Roy'),
(107,'College Street','Arson (minor)','01:30:00','Inspector Bose'),
(108,'Park Street','Drunk & Disorderly','23:55:00','Sub-Inspector Mitra'),
(109,'Behala Road','Theft','08:45:00','Inspector Das');

CREATE TABLE mansion_guest_list (
  guest_id INTEGER PRIMARY KEY, citizen_id INTEGER,
  arrival_time TEXT, departure_time TEXT, invite_status TEXT
);
INSERT INTO mansion_guest_list VALUES
(1,1001,'18:45:00','23:30:00','Confirmed'),
(2,1002,'19:00:00','21:15:00','VIP'),
(3,1003,'19:00:00','17:30:00','Confirmed'),
(4,1004,'17:00:00','23:30:00','Confirmed'),
(5,1005,'17:30:00','23:00:00','Confirmed'),
(6,1006,'18:15:00','21:15:00','VIP'),
(7,1007,'17:00:00','19:45:00','Confirmed'),
(8,1008,'18:00:00','22:45:00','VIP'),
(9,1009,'19:45:00','20:45:00','VIP'),
(10,1010,'17:15:00','19:00:00','Confirmed'),
(11,1011,'19:30:00','21:45:00','Plus-One'),
(12,1012,'17:30:00','19:30:00','Confirmed'),
(13,1013,'18:00:00','20:00:00','Confirmed'),
(14,1014,'18:30:00','22:30:00','VIP'),
(15,1015,'17:00:00','19:15:00','Confirmed'),
(16,1016,'19:00:00','21:00:00','Confirmed'),
(17,1017,'17:30:00','23:45:00','Confirmed'),
(18,1018,'18:00:00','20:30:00','Plus-One'),
(19,1019,'17:00:00','19:00:00','Confirmed'),
(20,1020,'18:45:00','23:00:00','VIP'),
(21,1021,'18:00:00','20:15:00','Confirmed'),
(22,1022,'17:45:00','19:30:00','Confirmed'),
(23,1023,'18:30:00','22:00:00','Confirmed'),
(24,1024,'17:00:00','20:00:00','VIP'),
(25,1025,'18:45:00','21:30:00','Confirmed'),
(26,1026,'17:15:00','19:45:00','Plus-One'),
(27,1027,'19:00:00','22:45:00','Confirmed'),
(28,1028,'17:30:00','20:30:00','Confirmed'),
(29,1029,'18:00:00','21:00:00','Confirmed'),
(30,1030,'19:15:00','23:15:00','VIP'),
(31,1031,'17:00:00','19:00:00','Confirmed'),
(32,1032,'18:45:00','22:00:00','Confirmed'),
(33,1033,'17:30:00','20:45:00','Confirmed'),
(34,1034,'18:00:00','21:45:00','Plus-One'),
(35,1035,'19:00:00','23:30:00','Confirmed'),
(36,1036,'17:15:00','18:45:00','Confirmed'),
(37,1037,'18:30:00','21:00:00','Confirmed'),
(38,1038,'17:00:00','19:30:00','Confirmed'),
(39,1039,'19:00:00','21:15:00','Plus-One'),
(40,1040,'18:00:00','22:30:00','VIP'),
(41,1041,'17:30:00','20:00:00','Confirmed'),
(42,1042,'18:30:00','00:00:00','Confirmed'),
(43,1043,'17:00:00','19:45:00','Confirmed'),
(44,1044,'18:15:00','22:15:00','Confirmed'),
(45,1045,'19:00:00','21:00:00','Confirmed'),
(46,1046,'17:30:00','20:15:00','Confirmed'),
(47,1047,'18:00:00','21:30:00','Plus-One'),
(48,1048,'17:15:00','19:15:00','Confirmed'),
(49,1049,'18:45:00','22:45:00','Confirmed'),
(50,1050,'19:00:00','23:00:00','VIP'),
(51,1051,'17:00:00','18:30:00','Confirmed'),
(52,1052,'18:30:00','21:15:00','Confirmed'),
(53,1053,'17:30:00','20:30:00','Confirmed'),
(54,1054,'18:00:00','22:00:00','Plus-One'),
(55,1055,'19:00:00','22:30:00','Confirmed'),
(56,1056,'17:15:00','19:00:00','Confirmed'),
(57,1057,'18:45:00','21:45:00','Confirmed'),
(58,1058,'17:00:00','20:00:00','Confirmed'),
(59,1059,'19:30:00','22:00:00','VIP'),
(60,1060,'17:30:00','19:30:00','Confirmed'),
(61,1061,'18:00:00','21:00:00','Confirmed'),
(62,1062,'17:00:00','18:45:00','Plus-One'),
(63,1063,'18:30:00','22:30:00','Confirmed'),
(64,1064,'19:00:00','21:30:00','Confirmed'),
(65,1065,'17:15:00','20:15:00','Confirmed'),
(66,1066,'18:00:00','22:00:00','VIP'),
(67,1067,'17:30:00','20:30:00','Confirmed'),
(68,1068,'18:45:00','21:45:00','Confirmed'),
(69,1069,'17:00:00','19:45:00','Confirmed'),
(70,1070,'19:00:00','22:15:00','Plus-One'),
(71,1071,'18:00:00','21:00:00','Confirmed'),
(72,1072,'17:30:00','20:00:00','Confirmed'),
(73,1073,'18:15:00','22:45:00','VIP'),
(74,1074,'17:00:00','19:00:00','Confirmed'),
(75,1075,'18:45:00','21:15:00','Confirmed'),
(76,1076,'19:00:00','23:00:00','Confirmed'),
(77,1077,'17:15:00','20:15:00','Plus-One'),
(78,1078,'18:00:00','22:00:00','Confirmed'),
(79,1079,'17:30:00','19:30:00','Confirmed'),
(80,1080,'18:30:00','21:30:00','Confirmed'),
(89,1089,'17:30:00','23:30:00','Confirmed');

CREATE TABLE calcutta_citizens (
  citizen_id INTEGER PRIMARY KEY, full_name TEXT,
  neighborhood TEXT, shoe_size INTEGER,
  footwear_preference TEXT, height_cm INTEGER, eye_color TEXT
);
INSERT INTO calcutta_citizens VALUES
(1001,'Subhash Samanta','Shyambazar',10,'Kolhapuri',172,'brown'),
(1002,'Rekha Dasgupta','Ballygunge',6,'Oxford',158,'hazel'),
(1003,'Sarada Chakraborty','Kalighat',10,'Kolhapuri',165,'brown'),
(1004,'Nirmal Ghosh','Hatibagan',8,'Leather',168,'dark'),
(1005,'Hiren Bose','Dum Dum',10,'Kolhapuri',180,'brown'),
(1006,'Mallika Sen','Park Street',5,'Sandal',155,'green'),
(1007,'Prafulla Das','Bhowanipore',9,'Rubber',175,'brown'),
(1008,'Ranajit Roy','New Market',10,'Kolhapuri',178,'dark'),
(1009,'Bijoya Mukherjee','Lake Town',7,'Oxford',160,'brown'),
(1010,'Gobinda Pal','Gariahat',11,'Boot',182,'hazel'),
(1011,'Sudhin Majumdar','Baghbazar',10,'Kolhapuri',170,'brown'),
(1012,'Pratima Sarkar','Jadavpur',6,'Sandal',162,'dark'),
(1013,'Kamala Basu','Tollygunge',8,'Chappal',157,'brown'),
(1014,'Indira Pramanik','Shyambazar',10,'Kolhapuri',163,'hazel'),
(1015,'Tarun Saha','Ultadanga',9,'Oxford',174,'brown'),
(1016,'Manorama Ray','Alipore',7,'Sandal',160,'dark'),
(1017,'Amitava Bose','Ballygunge',10,'Kolhapuri',177,'brown'),
(1018,'Chanda Dey','Rashbehari',8,'Chappal',159,'brown'),
(1019,'Swapna Hazra','Behala',6,'Sandal',156,'hazel'),
(1020,'Tarashankar Mitra','Sovabazar',11,'Boot',183,'dark'),
(1021,'Gopa Banerjee','Jodhpur Park',7,'Oxford',162,'brown'),
(1022,'Sudhin Sanyal','Dum Dum',10,'Kolhapuri',171,'brown'),
(1023,'Narayan Chatterjee','Behala',9,'Rubber',176,'dark'),
(1024,'Renuka Haldar','Park Street',6,'Sandal',158,'hazel'),
(1025,'Bimal Talukdar','Shyambazar',10,'Kolhapuri',169,'dark'),
(1026,'Lakshmi Dutta','Barrackpore',5,'Chappal',154,'brown'),
(1027,'Dipak Sinha','Alipore',9,'Oxford',178,'brown'),
(1028,'Anita Roy','Salt Lake',7,'Sandal',161,'hazel'),
(1029,'Mohan Kar','Entally',10,'Kolhapuri',173,'brown'),
(1030,'Mina Ghosh','Shyambazar',6,'Sandal',157,'dark'),
(1031,'Haru Mandal','Sodepur',11,'Boot',180,'brown'),
(1032,'Sukumar Basu','Garia',10,'Kolhapuri',172,'hazel'),
(1033,'Lila Sen','Rabindra Nagar',8,'Chappal',158,'brown'),
(1034,'Ashim Mukherjee','Bhowanipore',10,'Kolhapuri',175,'dark'),
(1035,'Kalyani Nath','Behala',7,'Oxford',162,'brown'),
(1036,'Nirode Bhattacharya','Tollygunge',9,'Rubber',170,'hazel'),
(1037,'Madhabi Paul','Baghbazar',8,'Chappal',160,'brown'),
(1038,'Prakash Chowdhury','Hatibagan',10,'Kolhapuri',176,'brown'),
(1039,'Uma Mitra','Dum Dum',6,'Sandal',155,'dark'),
(1040,'Dilip Chakraborty','Jadavpur',10,'Kolhapuri',174,'brown'),
(1041,'Sabitri Biswas','Kalighat',7,'Oxford',161,'hazel'),
(1042,'Bhavani Shankar','Shyambazar',10,'Kolhapuri',174,'dark'),
(1043,'Parimal Das','Gariahat',9,'Rubber',173,'brown'),
(1044,'Ranajit Bose','Kalighat',10,'Kolhapuri',172,'brown'),
(1045,'Supriya Ghosh','Park Street',5,'Sandal',156,'hazel'),
(1046,'Mrinal Banerjee','Barrackpore',11,'Boot',181,'dark'),
(1047,'Sefali Roy','Hatibagan',8,'Chappal',159,'brown'),
(1048,'Debdas Sen','Lake Town',9,'Oxford',177,'brown'),
(1049,'Prabha Giri','Baghbazar',10,'Kolhapuri',164,'hazel'),
(1050,'Khokon Sarkar','Sovabazar',10,'Kolhapuri',170,'brown'),
(1051,'Sudhir Pal','New Market',11,'Boot',182,'dark'),
(1052,'Fanibhushan Lahiri','Lake Town',10,'Kolhapuri',179,'brown'),
(1053,'Jyoti Nandi','Rashbehari',8,'Chappal',160,'hazel'),
(1054,'Abani Chandra','Ultadanga',10,'Kolhapuri',175,'brown'),
(1055,'Hemanta Das','Jadavpur',9,'Rubber',173,'dark'),
(1056,'Nibaran Ghosh','Entally',7,'Sandal',165,'brown'),
(1057,'Sunil Kar','Garia',10,'Kolhapuri',171,'brown'),
(1058,'Prova Basu','Behala',6,'Sandal',158,'hazel'),
(1059,'Tarit Sen','Alipore',10,'Kolhapuri',176,'dark'),
(1060,'Nabin Chakraborty','Sodepur',11,'Boot',180,'brown'),
(1061,'Charu Roy','Shyambazar',10,'Kolhapuri',172,'brown'),
(1062,'Puspa Mukherjee','Baghbazar',5,'Chappal',155,'dark'),
(1063,'Haripada Haldar','Ballygunge',10,'Kolhapuri',174,'brown'),
(1064,'Mamata Sinha','Park Street',7,'Oxford',162,'hazel'),
(1065,'Satya Datta','Bhowanipore',9,'Rubber',170,'brown'),
(1066,'Bela Bose','Hatibagan',6,'Sandal',160,'dark'),
(1067,'Sushil Boral','Shyambazar',9,'Chappal',170,'dark'),
(1068,'Niroda Pal','Gariahat',10,'Kolhapuri',168,'brown'),
(1069,'Shyamal Ghosh','Jadavpur',8,'Leather',175,'hazel'),
(1070,'Komol Sen','Tollygunge',10,'Kolhapuri',173,'brown'),
(1071,'Reba Sarkar','Ultadanga',7,'Sandal',161,'dark'),
(1072,'Haradhan Roy','Baghbazar',10,'Kolhapuri',178,'brown'),
(1073,'Sarat Nath','Sovabazar',11,'Boot',183,'hazel'),
(1074,'Nalini Mondal','Entally',8,'Chappal',159,'brown'),
(1075,'Pankaj Bose','Alipore',10,'Kolhapuri',174,'dark'),
(1076,'Kiran Mitra','Lake Town',9,'Rubber',172,'brown'),
(1077,'Suresh Chakravorty','Behala',10,'Kolhapuri',175,'hazel'),
(1078,'Bhabani Prasad','Barrackpore',10,'Kolhapuri',171,'brown'),
(1079,'Phani Ghosh','Kalighat',8,'Chappal',168,'dark'),
(1080,'Shanta Devi','Shyambazar',5,'Sandal',157,'brown'),
(1081,'Bipin Bihari','Gariahat',10,'Kolhapuri',176,'brown'),
(1082,'Nandini Das','Park Street',6,'Oxford',160,'hazel'),
(1083,'Kartick Roy','Hatibagan',9,'Rubber',174,'dark'),
(1084,'Rebati Haldar','Tollygunge',7,'Sandal',163,'brown'),
(1085,'Krishna Bose','Park Street',10,'Kolhapuri',175,'brown'),
(1086,'Tarakeswar Sen','Bhowanipore',10,'Kolhapuri',177,'dark'),
(1087,'Suchitra Mitra','Jadavpur',6,'Sandal',159,'brown'),
(1088,'Radha Raman','Baghbazar',10,'Kolhapuri',172,'hazel'),
(1089,'Devdas Mukherjee','Tollygunge',10,'Kolhapuri',178,'brown'),
(1090,'Nalini Chakra','Gariahat',8,'Chappal',160,'hazel'),
(1091,'Hemanta Basu','Sodepur',10,'Kolhapuri',174,'dark'),
(1092,'Mukul Das','Dum Dum',9,'Oxford',171,'brown'),
(1093,'Bibhuti Bhusal','Behala',10,'Kolhapuri',173,'hazel'),
(1094,'Sandhya Roy','Salt Lake',6,'Sandal',158,'brown'),
(1095,'Subal Roy','New Market',10,'Kolhapuri',168,'brown'),
(1096,'Rama Biswas','Ultadanga',10,'Kolhapuri',171,'dark'),
(1097,'Kedar Nath','Kalighat',11,'Boot',182,'brown'),
(1098,'Phul Kumari','Alipore',5,'Chappal',155,'hazel'),
(1099,'Noni Gopal','Entally',10,'Kolhapuri',176,'brown'),
(1100,'Santi Lal','Sovabazar',8,'Leather',167,'dark');

CREATE TABLE sweet_shop_orders (
  order_id INTEGER PRIMARY KEY, citizen_id INTEGER,
  item_description TEXT, order_date TEXT, shop_neighborhood TEXT
);
INSERT INTO sweet_shop_orders VALUES
(5001,1017,'Nalen Gur Sandesh (6 pcs)','1946-10-04','Ballygunge'),
(5002,1042,'Nalen Gur Sandesh (4 pcs)','1946-10-04','Shyambazar'),
(5003,1089,'Nalen Gur Sandesh (2 pcs)','1946-10-04','Tollygunge'),
(5004,1100,'Rasgulla (12 pcs)','1946-10-04','Sovabazar'),
(5005,1032,'Mishti Doi (3 cups)','1946-10-04','Garia'),
(5006,1044,'Nalen Gur Sandesh (3 pcs)','1946-10-04','Kalighat'),
(5007,1086,'Chamcham (6 pcs)','1946-10-04','Bhowanipore'),
(5008,1063,'Nalen Gur Sandesh (4 pcs)','1946-10-04','Ballygunge'),
(5009,1075,'Nalen Gur Sandesh (2 pcs)','1946-10-04','Alipore'),
(5010,1050,'Gulab Jamun (8 pcs)','1946-10-04','Sovabazar'),
(5011,1095,'Nalen Gur Sandesh (6 pcs)','1946-10-04','New Market'),
(5012,1081,'Nalen Gur Sandesh (3 pcs)','1946-10-04','Gariahat'),
(5013,1011,'Pantua (4 pcs)','1946-10-04','Baghbazar'),
(5014,1070,'Nalen Gur Sandesh (2 pcs)','1946-10-04','Tollygunge'),
(5015,1059,'Nalen Gur Sandesh (4 pcs)','1946-10-04','Alipore'),
(5016,1096,'Nalen Gur Sandesh (5 pcs)','1946-10-04','Ultadanga'),
(5017,1099,'Kheer Kadam (6 pcs)','1946-10-04','Entally'),
(5018,1088,'Nalen Gur Sandesh (3 pcs)','1946-10-04','Baghbazar'),
(5019,1078,'Nalen Gur Sandesh (4 pcs)','1946-10-04','Barrackpore'),
(5020,1072,'Nalen Gur Sandesh (2 pcs)','1946-10-04','Baghbazar'),
(5021,1054,'Nalen Gur Sandesh (6 pcs)','1946-10-04','Ultadanga'),
(5022,1068,'Mishti Doi (2 cups)','1946-10-04','Gariahat'),
(5023,1040,'Nalen Gur Sandesh (3 pcs)','1946-10-04','Jadavpur'),
(5024,1029,'Nalen Gur Sandesh (4 pcs)','1946-10-04','Entally'),
(5025,1001,'Rasgulla (6 pcs)','1946-10-04','Shyambazar'),
(5026,1008,'Chamcham (4 pcs)','1946-10-04','New Market'),
(5027,1025,'Nalen Gur Sandesh (4 pcs)','1946-10-04','Shyambazar'),
(5028,1091,'Nalen Gur Sandesh (2 pcs)','1946-10-04','Sodepur'),
(5029,1093,'Nalen Gur Sandesh (5 pcs)','1946-10-04','Behala'),
(5030,1077,'Nalen Gur Sandesh (6 pcs)','1946-10-04','Behala');

CREATE TABLE calcutta_tram_logs (
  route_id INTEGER PRIMARY KEY, ticket_prefix TEXT,
  destination TEXT, operating_hours TEXT
);
INSERT INTO calcutta_tram_logs VALUES
(201,'T-89','Shyambazar','06:00-22:30'),
(202,'T-12','Ballygunge','05:30-23:00'),
(203,'T-34','Tollygunge','06:00-21:00'),
(204,'T-56','Kalighat','05:45-22:00'),
(205,'T-78','Dum Dum','06:15-22:00'),
(206,'T-91','Park Street','06:00-23:30'),
(207,'T-23','Hatibagan','05:30-22:00'),
(208,'T-45','Gariahat','06:00-21:30'),
(209,'T-67','Ultadanga','05:45-21:00'),
(210,'T-11','Behala','06:30-20:00'),
(211,'T-33','Alipore','05:30-23:00'),
(212,'T-55','Jadavpur','06:00-21:00');

CREATE TABLE employment_history (
  record_id INTEGER PRIMARY KEY, citizen_id INTEGER,
  company_name TEXT, job_title TEXT,
  start_date TEXT, end_date TEXT, termination_reason TEXT
);
INSERT INTO employment_history VALUES
(5001,1042,'Hira Jewellers, Bowbazar','Apprentice Gem Cutter','1938-06-01','1944-02-28','Resigned'),
(5002,1042,'Sovabazar Gem Works','Master Gem Cutter','1944-03-15','1946-07-20','Embezzlement'),
(5003,1017,'Eastern Trading Co.','Clerk','1940-01-01','1945-12-31','Resigned'),
(5004,1089,'Calcutta Port Trust','Loader','1942-03-01','1946-09-30','Resigned'),
(5005,1001,'Shyambazar Textile Mill','Weaver','1939-05-01','1946-10-04','Active'),
(5006,1022,'Bengal Iron Works','Foreman','1935-08-01','1944-06-30','Retired'),
(5007,1025,'North Calcutta Bank','Peon','1941-01-15','1946-09-30','Dismissed'),
(5008,1032,'Garia Press','Compositor','1938-03-01','1946-10-04','Active'),
(5009,1038,'Howrah Bridge Works','Engineer','1942-07-01','1946-10-04','Active'),
(5010,1044,'Kalighat Temple Trust','Accountant','1940-10-01','1946-10-04','Active'),
(5011,1052,'Lake Market Co-op','Store Manager','1937-05-01','1946-10-04','Active'),
(5012,1057,'Garia Motor Works','Mechanic','1943-01-01','1946-10-04','Active'),
(5013,1059,'Alipore Law Firm','Clerk','1945-06-01','1946-10-04','Active'),
(5014,1063,'Choudhury Textiles','Salesman','1940-03-01','1946-08-31','Resigned'),
(5015,1067,'Sovabazar Ice Factory','Worker','1944-09-01','1946-10-04','Active'),
(5016,1070,'Southern Printing House','Typesetter','1941-04-01','1946-10-04','Active'),
(5017,1075,'New Market Cold Store','Supervisor','1939-11-01','1946-10-04','Active'),
(5018,1078,'Barrackpore Jute Mill','Spinner','1936-02-01','1946-10-04','Active'),
(5019,1081,'Gariahat Cloth Merchant','Assistant','1943-07-01','1946-10-04','Active'),
(5020,1086,'Bhowanipore Book Depot','Bookseller','1942-01-01','1946-10-04','Active'),
(5021,1088,'Baghbazar Grain Market','Trader','1938-09-01','1946-10-04','Active'),
(5022,1091,'Sodepur Cotton Mill','Worker','1944-04-01','1946-10-04','Active'),
(5023,1093,'Behala Brick Kiln','Supervisor','1940-06-01','1946-10-04','Active'),
(5024,1095,'New Market Fishery','Seller','1937-08-01','1946-10-04','Active'),
(5025,1096,'Ultadanga Cycle Repair','Mechanic','1943-02-01','1946-10-04','Active');

CREATE TABLE rajbari_staff (
  staff_id INTEGER PRIMARY KEY, full_name TEXT,
  role TEXT, shift_start TEXT, shift_end TEXT
);
INSERT INTO rajbari_staff VALUES
(301,'Lata Shankar','Maid','07:00:00','21:00:00'),
(302,'Gopal Halder','Head Butler','08:00:00','22:00:00'),
(303,'Surendra Koley','Cook','06:00:00','20:00:00'),
(304,'Bindu Sarkar','Maid','07:00:00','19:00:00'),
(305,'Hari Mondal','Gardener','06:00:00','18:00:00'),
(306,'Raju Vishwakarma','Electrician','09:00:00','21:00:00'),
(307,'Phool Kumari','Maid','08:00:00','20:00:00'),
(308,'Babu Lal','Gatekeeper','00:00:00','24:00:00'),
(309,'Hiralal Saha','Electrician','09:00:00','21:00:00'),
(310,'Mira Devi','Kitchen Helper','06:00:00','18:00:00'),
(311,'Ramesh Koley','Dhobi','07:00:00','17:00:00'),
(312,'Shakuntala','Lady's Maid','08:00:00','22:00:00'),
(313,'Govind Prasad','Footman','10:00:00','22:00:00'),
(314,'Jagannath Bera','Night Watchman','20:00:00','06:00:00'),
(315,'Sudha Kumari','Ayah','07:00:00','21:00:00');

CREATE VIEW calcutta_investigation_master_view AS
SELECT
  cc.citizen_id, cc.full_name, cc.neighborhood,
  cc.shoe_size, cc.footwear_preference,
  mgl.arrival_time, mgl.departure_time,
  sso.item_description, sso.order_date,
  eh.job_title, eh.termination_reason
FROM calcutta_citizens cc
LEFT JOIN mansion_guest_list mgl ON mgl.citizen_id = cc.citizen_id
LEFT JOIN sweet_shop_orders sso ON sso.citizen_id = cc.citizen_id
LEFT JOIN employment_history eh ON eh.citizen_id = cc.citizen_id;
`,

// ═══════════════════════════════════════════════════════════════════════════
// CASE 2 — THE PHANTOM WITNESS (Mumbai 2003)
// A journalist was murdered in a 5-star hotel during a political summit.
// The killer is one of the 80 registered guests — but erased their check-in.
// ═══════════════════════════════════════════════════════════════════════════
2: `
CREATE TABLE hotel_guests (
  guest_id INTEGER PRIMARY KEY,
  full_name TEXT, nationality TEXT,
  check_in TEXT, check_out TEXT,
  room_number INTEGER, vip_status INTEGER,
  purpose_of_visit TEXT, booked_by TEXT
);
INSERT INTO hotel_guests VALUES
(1001,'Arvind Mehta','Indian','2003-11-14 14:20','2003-11-17 09:00',412,0,'Business','Self'),
(1002,'Priya Nair','Indian','2003-11-14 15:00','2003-11-17 11:00',308,0,'Conference','Company'),
(1003,'James Holloway','British','2003-11-13 10:00','2003-11-16 08:00',505,1,'Diplomatic','Embassy'),
(1004,'Chen Wei','Chinese','2003-11-14 11:30','2003-11-15 22:00',217,0,'Business','Agent'),
(1005,'Sunita Rao','Indian','2003-11-13 16:00','2003-11-17 12:00',311,0,'Tourism','Self'),
(1006,'Marcus Andersen','Swedish','2003-11-14 09:00','2003-11-16 14:00',602,0,'Conference','Company'),
(1007,'Layla Al-Rashid','UAE','2003-11-12 18:00','2003-11-18 10:00',701,1,'Diplomatic','Embassy'),
(1008,'Rajan Pillai','Indian','2003-11-14 13:00','2003-11-16 11:00',404,0,'Conference','Company'),
(1009,'Fatima Zahra','Moroccan','2003-11-14 12:00','2003-11-16 09:00',215,0,'Tourism','Agent'),
(1010,'Viktor Morozov','Russian','2003-11-13 20:00','2003-11-16 06:00',510,0,'Business','Company'),
(1011,'Ananya Krishnan','Indian','2003-11-14 14:30','2003-11-17 10:00',302,0,'Conference','Company'),
(1012,'Paulo Salave','Brazilian','2003-11-14 11:00','2003-11-15 20:00',115,0,'Business','Self'),
(1013,'Simone Laurent','French','2003-11-13 15:00','2003-11-16 11:00',418,0,'Tourism','Agent'),
(1014,'Haruto Nakamura','Japanese','2003-11-14 09:30','2003-11-16 07:00',319,0,'Business','Company'),
(1015,'Olga Petersen','Danish','2003-11-14 16:00','2003-11-17 13:00',520,0,'Conference','Company'),
(1016,'Raj Kapoor','Indian','2003-11-14 10:00','2003-11-16 15:00',208,0,'Business','Self'),
(1017,'Amara Diallo','Senegalese','2003-11-14 12:30','2003-11-16 08:00',110,0,'Conference','Company'),
(1018,'Isabella Conti','Italian','2003-11-13 17:00','2003-11-17 09:00',614,0,'Tourism','Self'),
(1019,'Amir Hassan','Egyptian','2003-11-14 11:00','2003-11-16 10:00',421,0,'Business','Agent'),
(1020,'Liang Fang','Chinese','2003-11-14 08:00','2003-11-15 23:00',317,0,'Business','Company'),
(1021,'Deepak Sharma','Indian','2003-11-14 14:00','2003-11-17 11:00',505,0,'Conference','Company'),
(1022,'Maria Gonzalez','Spanish','2003-11-13 19:00','2003-11-16 09:00',218,0,'Tourism','Agent'),
(1023,'Thomas Braun','German','2003-11-14 10:30','2003-11-16 12:00',408,0,'Business','Company'),
(1024,'Nadia Volkov','Russian','2003-11-14 15:00','2003-11-17 08:00',610,0,'Conference','Company'),
(1025,'Suresh Kumar','Indian','2003-11-14 13:00','2003-11-15 22:00',212,0,'Business','Self'),
(1026,'Elena Popescu','Romanian','2003-11-14 11:00','2003-11-16 10:00',314,0,'Tourism','Agent'),
(1027,'Ahmed Khalil','Jordanian','2003-11-13 14:00','2003-11-17 12:00',511,0,'Business','Company'),
(1028,'Yuki Tanaka','Japanese','2003-11-14 09:00','2003-11-16 08:00',216,0,'Business','Company'),
(1029,'Camille Dubois','French','2003-11-14 12:00','2003-11-17 10:00',415,0,'Tourism','Self'),
(1030,'Ravi Shankar','Indian','2003-11-13 18:00','2003-11-17 09:00',607,0,'Conference','Company'),
(1031,'Ingrid Holm','Norwegian','2003-11-14 10:00','2003-11-16 11:00',312,0,'Conference','Company'),
(1032,'Omar Farouq','Algerian','2003-11-14 13:30','2003-11-16 07:00',117,0,'Business','Agent'),
(1033,'Priyanka Verma','Indian','2003-11-14 14:00','2003-11-17 11:00',504,0,'Conference','Company'),
(1034,'Mikhail Sobol','Russian','2003-11-14 11:00','2003-11-15 21:00',209,0,'Business','Company'),
(1035,'Aiko Kimura','Japanese','2003-11-14 15:00','2003-11-17 10:00',611,0,'Tourism','Agent'),
(1036,'Rodrigo Silva','Portuguese','2003-11-13 16:00','2003-11-16 12:00',416,0,'Business','Self'),
(1037,'Nina Bergmann','German','2003-11-14 09:00','2003-11-16 09:00',213,0,'Conference','Company'),
(1038,'Sanjay Patel','Indian','2003-11-14 12:30','2003-11-16 10:00',315,0,'Business','Company'),
(1039,'Fatou Cissé','Guinean','2003-11-14 11:00','2003-11-16 08:00',118,0,'Conference','Company'),
(1040,'Alexei Romanov','Russian','2003-11-14 10:00','2003-11-15 19:00',517,0,'Business','Agent'),
(1041,'Kavitha Menon','Indian','2003-11-14 14:00','2003-11-17 12:00',403,0,'Conference','Company'),
(1042,'Lars Eriksen','Swedish','2003-11-14 09:30','2003-11-16 08:00',214,0,'Business','Company'),
(1043,'Yasmin Khalid','Pakistani','2003-11-13 15:00','2003-11-17 09:00',612,0,'Business','Agent'),
(1044,'Samuel Okafor','Nigerian','2003-11-14 12:00','2003-11-16 11:00',310,0,'Conference','Company'),
(1045,'Hiroshi Watanabe','Japanese','2003-11-14 13:00','2003-11-16 10:00',219,0,'Business','Company'),
(1046,'Rashida Banu','Bangladeshi','2003-11-14 11:30','2003-11-17 09:00',413,0,'Tourism','Self'),
(1047,'Pierre Moreau','French','2003-11-14 10:00','2003-11-15 22:00',116,0,'Business','Agent'),
(1048,'Zhen Liu','Chinese','2003-11-14 09:00','2003-11-16 07:00',512,0,'Business','Company'),
(1049,'Amelia Brooks','American','2003-11-13 19:00','2003-11-17 11:00',709,1,'Diplomatic','Embassy'),
(1050,'Gopal Menon','Indian','2003-11-14 14:30','2003-11-17 10:00',306,0,'Conference','Company'),
(1051,'Sofia Vasquez','Colombian','2003-11-14 11:00','2003-11-16 09:00',217,0,'Tourism','Agent'),
(1052,'Kwame Asante','Ghanaian','2003-11-14 12:00','2003-11-16 08:00',114,0,'Conference','Company'),
(1053,'Natasha Ivanova','Russian','2003-11-14 15:30','2003-11-17 12:00',615,0,'Business','Company'),
(1054,'Abdul Rahman','Saudi','2003-11-13 14:00','2003-11-17 08:00',706,1,'Diplomatic','Embassy'),
(1055,'Meera Pillai','Indian','2003-11-14 13:00','2003-11-16 10:00',409,0,'Conference','Company'),
(1056,'Diego Hernandez','Mexican','2003-11-14 10:30','2003-11-16 11:00',311,0,'Business','Self'),
(1057,'Parveen Sultana','Indian','2003-11-14 12:00','2003-11-17 09:00',512,0,'Conference','Company'),
(1058,'Wouter De Bruyne','Belgian','2003-11-14 09:00','2003-11-16 08:00',218,0,'Business','Company'),
(1059,'Ramona Flores','Filipino','2003-11-14 11:00','2003-11-16 09:00',316,0,'Tourism','Agent'),
(1060,'Zubair Ahmed','Afghani','2003-11-14 12:30','2003-11-15 23:00',113,0,'Business','Agent'),
(1061,'Dipali Bose','Indian','2003-11-14 14:00','2003-11-17 10:00',407,0,'Conference','Company'),
(1062,'Oren Cohen','Israeli','2003-11-14 10:00','2003-11-16 07:00',513,0,'Business','Company'),
(1063,'Soo-Yeon Park','South Korean','2003-11-14 13:30','2003-11-17 11:00',610,0,'Conference','Company'),
(1064,'Nadira Karimov','Uzbek','2003-11-14 11:00','2003-11-16 10:00',215,0,'Business','Agent'),
(1065,'Bernhard Fischer','Austrian','2003-11-14 09:30','2003-11-16 12:00',412,0,'Conference','Company'),
(1066,'Tomás Novák','Czech','2003-11-14 12:00','2003-11-16 09:00',317,0,'Business','Company'),
(1067,'Chidinma Obi','Nigerian','2003-11-14 14:30','2003-11-17 10:00',516,0,'Conference','Company'),
(1068,'Vanya Petrov','Bulgarian','2003-11-14 10:00','2003-11-16 08:00',214,0,'Business','Self'),
(1069,'Laleh Ahmadi','Iranian','2003-11-14 11:30','2003-11-17 09:00',413,0,'Business','Agent'),
(1070,'Martin Lefebvre','French','2003-11-14 13:00','2003-11-16 11:00',311,0,'Conference','Company'),
(1071,'Hana Kovác','Slovak','2003-11-14 09:00','2003-11-16 08:00',217,0,'Business','Company'),
(1072,'Dilnoza Yusupova','Uzbek','2003-11-14 12:00','2003-11-16 10:00',315,0,'Tourism','Agent'),
(1073,'Femi Adeyemi','Nigerian','2003-11-14 11:00','2003-11-16 09:00',116,0,'Conference','Company'),
(1074,'Sigrid Larsen','Norwegian','2003-11-14 10:30','2003-11-16 11:00',418,0,'Business','Company'),
(1075,'Babak Tehrani','Iranian','2003-11-14 14:00','2003-11-17 12:00',619,0,'Business','Agent'),
(1076,'Solange Mbeki','South African','2003-11-14 09:30','2003-11-16 08:00',216,0,'Conference','Company'),
(1077,'Taras Bondarenko','Ukrainian','2003-11-14 13:30','2003-11-16 10:00',312,0,'Business','Company'),
(1078,'Imelda Cruz','Filipino','2003-11-13 17:00','2003-11-17 11:00',710,1,'Diplomatic','Embassy'),
(1079,'Gerard Walsh','Irish','2003-11-14 12:00','2003-11-16 09:00',214,0,'Business','Self'),
(1080,'Yosef Mizrahi','Israeli','2003-11-14 10:00','2003-11-16 08:00',411,0,'Business','Company');

CREATE TABLE room_access_logs (
  log_id INTEGER PRIMARY KEY,
  guest_id INTEGER, room_number INTEGER,
  accessed_room INTEGER, access_time TEXT, access_type TEXT
);
INSERT INTO room_access_logs VALUES
(1,1010,510,401,'2003-11-15 01:12','Key Card Entry'),
(2,1010,510,401,'2003-11-15 01:47','Key Card Exit'),
(3,1040,517,401,'2003-11-14 23:55','Key Card Entry'),
(4,1040,517,401,'2003-11-15 00:08','Key Card Exit'),
(5,1034,209,401,'2003-11-15 00:31','Passkey Entry'),
(6,1034,209,401,'2003-11-15 00:42','Passkey Exit'),
(7,1060,113,401,'2003-11-14 23:40','Key Card Entry'),
(8,1060,113,401,'2003-11-14 23:52','Key Card Exit'),
(9,1003,505,401,'2003-11-15 02:10','Master Key Entry'),
(10,1068,214,401,'2003-11-15 01:30','Passkey Entry'),
(11,1068,214,401,'2003-11-15 01:58','Passkey Exit'),
(12,1010,510,510,'2003-11-15 00:00','Own Room Entry'),
(13,1040,517,517,'2003-11-14 22:00','Own Room Entry'),
(14,1001,412,412,'2003-11-15 00:15','Own Room Entry'),
(15,1025,212,212,'2003-11-14 21:00','Own Room Entry'),
(16,1016,208,208,'2003-11-14 22:30','Own Room Entry'),
(17,1038,315,315,'2003-11-14 23:00','Own Room Entry'),
(18,1062,513,513,'2003-11-14 23:30','Own Room Entry'),
(19,1047,116,116,'2003-11-14 21:45','Own Room Entry'),
(20,1012,115,401,'2003-11-15 00:50','Key Card Entry'),
(21,1012,115,401,'2003-11-15 01:05','Key Card Exit');

CREATE TABLE hotel_phone_logs (
  call_id INTEGER PRIMARY KEY,
  caller_room INTEGER, callee_room INTEGER,
  call_time TEXT, duration_seconds INTEGER, call_type TEXT
);
INSERT INTO hotel_phone_logs VALUES
(1,510,401,'2003-11-14 22:15',120,'Internal'),
(2,510,401,'2003-11-14 23:10',45,'Internal'),
(3,510,0,'2003-11-14 23:55',180,'External'),
(4,209,401,'2003-11-14 20:30',90,'Internal'),
(5,217,401,'2003-11-14 21:00',60,'Internal'),
(6,412,401,'2003-11-14 19:00',240,'Internal'),
(7,214,401,'2003-11-15 00:15',30,'Internal'),
(8,113,401,'2003-11-14 22:45',75,'Internal'),
(9,115,401,'2003-11-14 20:00',150,'Internal'),
(10,517,401,'2003-11-14 18:30',300,'Internal'),
(11,401,0,'2003-11-14 21:30',600,'External'),
(12,601,401,'2003-11-14 17:00',90,'Internal'),
(13,310,401,'2003-11-14 16:30',45,'Internal'),
(14,412,601,'2003-11-14 15:00',120,'Internal'),
(15,510,217,'2003-11-14 14:00',80,'Internal');

CREATE TABLE journalist_contacts (
  contact_id INTEGER PRIMARY KEY,
  journalist_name TEXT, contact_type TEXT,
  contact_name TEXT, known_conflict TEXT
);
INSERT INTO journalist_contacts VALUES
(1,'Rajan Mehta','Source','Viktor Morozov','Morozov threatened to sue over 2002 exposé'),
(2,'Rajan Mehta','Colleague','Ananya Krishnan','No conflict'),
(3,'Rajan Mehta','Subject','Alexei Romanov','Romanov denied Mehta press credentials in Moscow'),
(4,'Rajan Mehta','Source','Mikhail Sobol','Paid informant'),
(5,'Rajan Mehta','Rival','Vanya Petrov','Competing story on same oil deal'),
(6,'Rajan Mehta','Subject','Zubair Ahmed','Mehta published allegations of arms dealing'),
(7,'Rajan Mehta','Friend','Ravi Shankar','College roommate');

CREATE TABLE staff_master (
  staff_id INTEGER PRIMARY KEY,
  full_name TEXT, department TEXT,
  shift TEXT, has_master_key INTEGER
);
INSERT INTO staff_master VALUES
(201,'Balram Singh','Security','Night',1),
(202,'Kaveri Devi','Housekeeping','Night',0),
(203,'Suresh Iyer','Front Desk','Night',1),
(204,'Pradeep Nath','Security','Night',1),
(205,'Radha Krishnan','Room Service','Night',0),
(206,'Meenu Bala','Housekeeping','Day',0),
(207,'Joseph Mascarenhas','Security','Day',1),
(208,'Tina D Souza','Front Desk','Day',0),
(209,'Ramesh Pillai','Maintenance','Night',1),
(210,'Anita George','Housekeeping','Night',0);

CREATE TABLE minibar_charges (
  charge_id INTEGER PRIMARY KEY,
  room_number INTEGER, item TEXT,
  charge_time TEXT, amount REAL
);
INSERT INTO minibar_charges VALUES
(1,510,'Whisky (2 bottles)','2003-11-14 21:30',2400),
(2,510,'Soda (3 cans)','2003-11-14 21:30',300),
(3,209,'Vodka (1 bottle)','2003-11-14 22:00',1200),
(4,517,'Beer (4 bottles)','2003-11-14 20:00',800),
(5,401,'Mineral Water (2)','2003-11-14 18:00',200),
(6,214,'Rum (1 bottle)','2003-11-14 23:00',1100),
(7,113,'Whisky (1 bottle)','2003-11-14 22:45',1200),
(8,115,'Beer (2 bottles)','2003-11-14 19:00',400),
(9,412,'Gin (1 bottle)','2003-11-14 20:00',1000),
(10,510,'Peanuts (3 packs)','2003-11-14 23:00',150),
(11,209,'Tonic (2 cans)','2003-11-14 22:30',200),
(12,310,'Whisky (1 bottle)','2003-11-14 21:00',1200),
(13,510,'Champagne (1 bottle)','2003-11-15 00:30',3500),
(14,214,'Chocolate (2 bars)','2003-11-14 23:30',180),
(15,517,'Chips (2 packs)','2003-11-14 21:00',120);
`,

// ═══════════════════════════════════════════════════════════════════════════
// CASE 3 — THE DIGITAL HEIST (Bangalore 2019)
// $50 million stolen from a fintech company's core banking system.
// An insider leaked credentials — find who and how.
// ═══════════════════════════════════════════════════════════════════════════
3: `
CREATE TABLE employees (
  emp_id INTEGER PRIMARY KEY,
  full_name TEXT, department TEXT, role TEXT,
  salary REAL, join_date TEXT,
  clearance_level INTEGER, manager_id INTEGER
);
INSERT INTO employees VALUES
(1,'Raghav Srinivas','Engineering','VP Engineering',3500000,'2015-03-01',5,NULL),
(2,'Anita Desai','Finance','CFO',4200000,'2013-06-15',5,NULL),
(3,'Prashant Kulkarni','Engineering','Senior Engineer',1800000,'2016-08-01',4,1),
(4,'Meena Iyer','Security','CISO',3800000,'2014-11-01',5,NULL),
(5,'Karthik Rajan','Engineering','Backend Engineer',1400000,'2018-02-14',3,1),
(6,'Sudha Pillai','HR','HR Manager',1600000,'2017-05-20',2,NULL),
(7,'Venkat Sharma','Finance','Senior Analyst',1500000,'2017-09-01',3,2),
(8,'Rohan Mehta','Engineering','DevOps Engineer',1600000,'2018-07-01',4,1),
(9,'Divya Nair','Security','Security Analyst',1300000,'2019-01-15',4,4),
(10,'Arun Kumar','Database','DBA Lead',1700000,'2016-04-01',5,NULL),
(11,'Swathi Reddy','Engineering','Frontend Engineer',1200000,'2019-03-01',2,1),
(12,'Sanjay Joshi','Finance','Analyst',1100000,'2019-06-01',2,2),
(13,'Pooja Shah','Database','Junior DBA',900000,'2020-01-15',4,10),
(14,'Nikhil Verma','Engineering','Architect',2200000,'2015-09-01',4,1),
(15,'Leela Krishna','Security','Pen Tester',1400000,'2018-10-01',4,4),
(16,'Harish Babu','Finance','Controller',1900000,'2016-12-01',3,2),
(17,'Deepa Subramaniam','Engineering','QA Lead',1300000,'2017-08-01',2,1),
(18,'Mohit Gupta','IT Ops','SysAdmin',1100000,'2019-04-01',3,NULL),
(19,'Vidya Murthy','Database','DBA',1200000,'2018-11-01',5,10),
(20,'Ravi Chandran','Engineering','Backend Engineer',1350000,'2018-03-01',3,1),
(21,'Kavitha Sundaram','Finance','Treasury Head',2100000,'2015-07-01',4,2),
(22,'Prasad Rao','Engineering','Backend Engineer',1380000,'2018-05-01',3,1),
(23,'Neeraja Pillai','Security','Security Analyst',1250000,'2019-08-01',3,4),
(24,'Suresh Nambiar','IT Ops','Network Admin',1150000,'2018-09-01',3,NULL),
(25,'Geetha Krishnamurthy','Finance','Analyst',1050000,'2020-02-01',2,2),
(26,'Manoj Tiwari','Engineering','SRE',1450000,'2017-11-01',3,1),
(27,'Bhavna Choudhary','HR','Recruiter',950000,'2019-10-01',1,6),
(28,'Ajay Bose','Engineering','Backend Engineer',1300000,'2019-01-01',3,1),
(29,'Ritu Malhotra','Finance','Risk Analyst',1400000,'2017-04-01',3,2),
(30,'Sunil Bhatt','IT Ops','SysAdmin',1050000,'2020-04-01',3,NULL),
(31,'Archana Shetty','Database','DBA',1180000,'2018-12-01',5,10),
(32,'Vinod Pillai','Engineering','Backend Engineer',1320000,'2018-06-01',3,1),
(33,'Kamala Venkatesan','Security','Analyst',1200000,'2019-09-01',3,4),
(34,'Tejas Patel','Engineering','Mobile Engineer',1150000,'2019-07-01',2,1),
(35,'Usha Narayanan','Finance','Accountant',1000000,'2019-05-01',2,2),
(36,'Balaji Krishnan','Database','DBA',1160000,'2019-02-01',5,10),
(37,'Chitra Gopalan','Engineering','QA',950000,'2020-01-01',2,17),
(38,'Sachin Pawar','IT Ops','SysAdmin',1080000,'2019-11-01',3,NULL),
(39,'Anand Raj','Security','SOC Analyst',1100000,'2020-03-01',3,4),
(40,'Mala Krishnaswamy','Finance','Treasury Analyst',1120000,'2018-07-01',3,21);

CREATE TABLE system_access_logs (
  log_id INTEGER PRIMARY KEY,
  emp_id INTEGER, system_name TEXT,
  access_time TEXT, action TEXT,
  ip_address TEXT, status TEXT
);
INSERT INTO system_access_logs VALUES
(1,10,'CORE_BANKING_DB','2019-09-12 02:14:33','SELECT * FROM accounts','10.0.1.10','SUCCESS'),
(2,19,'CORE_BANKING_DB','2019-09-12 02:15:01','EXPORT accounts TO FILE','10.0.1.19','SUCCESS'),
(3,10,'CORE_BANKING_DB','2019-09-12 02:14:50','GRANT SELECT ON transfers TO usr_ext_1','10.0.1.10','SUCCESS'),
(4,31,'CORE_BANKING_DB','2019-09-12 02:16:00','SELECT * FROM transfers','10.0.1.31','SUCCESS'),
(5,36,'CORE_BANKING_DB','2019-09-12 02:17:30','EXPORT transfers TO FILE','10.0.1.36','SUCCESS'),
(6,13,'CORE_BANKING_DB','2019-09-12 02:18:00','CREATE USER ext_agent_99','10.0.1.13','SUCCESS'),
(7,1,'ADMIN_PANEL','2019-09-12 02:05:00','LOGIN','10.0.1.1','SUCCESS'),
(8,4,'SECURITY_CONSOLE','2019-09-12 02:01:00','LOGIN','10.0.1.4','SUCCESS'),
(9,14,'CODE_REPO','2019-09-12 00:30:00','COMMIT payment_gateway.py','10.0.1.14','SUCCESS'),
(10,8,'CI_CD_PIPELINE','2019-09-12 00:45:00','DEPLOY payment-service v2.1.3','10.0.1.8','SUCCESS'),
(11,10,'CORE_BANKING_DB','2019-09-11 22:00:00','SCHEMA BACKUP','10.0.1.10','SUCCESS'),
(12,19,'CORE_BANKING_DB','2019-09-11 21:30:00','ROUTINE QUERY','10.0.1.19','SUCCESS'),
(13,3,'DEV_SERVER','2019-09-12 01:00:00','SSH LOGIN','10.0.1.3','SUCCESS'),
(14,5,'DEV_SERVER','2019-09-12 01:15:00','SSH LOGIN','10.0.1.5','SUCCESS'),
(15,22,'DEV_SERVER','2019-09-12 01:20:00','SSH LOGIN','10.0.1.22','SUCCESS'),
(16,10,'CORE_BANKING_DB','2019-09-12 02:19:00','REVOKE ALL ON transfers FROM public','10.0.1.10','FAILED'),
(17,36,'CORE_BANKING_DB','2019-09-12 02:20:00','DELETE FROM audit_log WHERE date=today','10.0.1.36','SUCCESS'),
(18,13,'CORE_BANKING_DB','2019-09-12 02:21:00','DROP USER ext_agent_99','10.0.1.13','FAILED'),
(19,31,'CORE_BANKING_DB','2019-09-12 02:22:00','EXPORT balances TO FILE','10.0.1.31','SUCCESS'),
(20,19,'CORE_BANKING_DB','2019-09-12 03:01:00','LOGIN','185.220.101.45','SUCCESS'),
(21,4,'SECURITY_CONSOLE','2019-09-12 02:00:00','DISABLE IDS RULE 4421','10.0.1.4','SUCCESS'),
(22,9,'SECURITY_CONSOLE','2019-09-12 02:02:00','VIEW ALERTS','10.0.1.9','SUCCESS'),
(23,10,'CORE_BANKING_DB','2019-09-12 02:13:00','DISABLE TRANSACTION LOGGING','10.0.1.10','SUCCESS'),
(24,8,'MONITORING','2019-09-12 02:10:00','PAUSE ALERT NOTIFICATIONS','10.0.1.8','SUCCESS'),
(25,10,'CORE_BANKING_DB','2019-09-12 04:00:00','ENABLE TRANSACTION LOGGING','10.0.1.10','SUCCESS');

CREATE TABLE financial_transactions (
  txn_id TEXT PRIMARY KEY,
  from_account TEXT, to_account TEXT,
  amount REAL, txn_time TEXT,
  txn_type TEXT, approved_by INTEGER, flagged INTEGER
);
INSERT INTO financial_transactions VALUES
('TXN-8821-A','ACC-CORP-001','ACC-EXT-77781',8500000,'2019-09-12 02:25:00','Wire Transfer',10,1),
('TXN-8821-B','ACC-CORP-001','ACC-EXT-77782',7200000,'2019-09-12 02:26:00','Wire Transfer',10,1),
('TXN-8821-C','ACC-CORP-002','ACC-EXT-77783',6800000,'2019-09-12 02:27:00','Wire Transfer',10,1),
('TXN-8821-D','ACC-CORP-003','ACC-EXT-77784',9100000,'2019-09-12 02:28:00','Wire Transfer',19,1),
('TXN-8821-E','ACC-CORP-001','ACC-EXT-77785',7400000,'2019-09-12 02:29:00','Wire Transfer',36,1),
('TXN-8821-F','ACC-CORP-004','ACC-EXT-77786',5500000,'2019-09-12 02:30:00','Wire Transfer',36,1),
('TXN-NORM-01','ACC-CUST-112','ACC-CUST-334',45000,'2019-09-11 09:15:00','NEFT',7,0),
('TXN-NORM-02','ACC-CUST-220','ACC-CUST-119',120000,'2019-09-11 11:30:00','IMPS',7,0),
('TXN-NORM-03','ACC-CUST-445','ACC-CUST-678',75000,'2019-09-11 14:00:00','NEFT',12,0),
('TXN-NORM-04','ACC-CUST-332','ACC-CUST-881',200000,'2019-09-11 15:30:00','RTGS',16,0),
('TXN-NORM-05','ACC-CUST-550','ACC-CUST-220',50000,'2019-09-11 16:00:00','IMPS',7,0);

CREATE TABLE employee_badges (
  badge_id INTEGER PRIMARY KEY,
  emp_id INTEGER, badge_type TEXT,
  issued_date TEXT, can_access_server_room INTEGER,
  can_access_core_db INTEGER, can_access_exec_floor INTEGER
);
INSERT INTO employee_badges VALUES
(1,1,'Executive',  '2015-03-01',1,1,1),
(2,2,'Executive',  '2013-06-15',0,0,1),
(3,3,'Engineering','2016-08-01',1,0,0),
(4,4,'Executive',  '2014-11-01',1,1,1),
(5,5,'Engineering','2018-02-14',1,0,0),
(6,6,'Staff',      '2017-05-20',0,0,0),
(7,7,'Finance',    '2017-09-01',0,0,0),
(8,8,'Engineering','2018-07-01',1,1,0),
(9,9,'Security',   '2019-01-15',1,1,0),
(10,10,'Database', '2016-04-01',1,1,0),
(11,11,'Engineering','2019-03-01',0,0,0),
(12,12,'Finance',  '2019-06-01',0,0,0),
(13,13,'Database', '2020-01-15',1,1,0),
(14,14,'Engineering','2015-09-01',1,0,0),
(15,15,'Security', '2018-10-01',1,1,0),
(16,16,'Finance',  '2016-12-01',0,0,0),
(17,17,'Engineering','2017-08-01',0,0,0),
(18,18,'IT Ops',   '2019-04-01',1,0,0),
(19,19,'Database', '2018-11-01',1,1,0),
(20,20,'Engineering','2018-03-01',1,0,0),
(21,21,'Finance',  '2015-07-01',0,0,1),
(22,22,'Engineering','2018-05-01',1,0,0),
(23,23,'Security', '2019-08-01',1,0,0),
(24,24,'IT Ops',   '2018-09-01',1,0,0),
(25,25,'Finance',  '2020-02-01',0,0,0),
(26,26,'Engineering','2017-11-01',1,0,0),
(27,27,'Staff',    '2019-10-01',0,0,0),
(28,28,'Engineering','2019-01-01',1,0,0),
(29,29,'Finance',  '2017-04-01',0,0,0),
(30,30,'IT Ops',   '2020-04-01',1,0,0),
(31,31,'Database', '2018-12-01',1,1,0),
(32,32,'Engineering','2018-06-01',1,0,0),
(33,33,'Security', '2019-09-01',1,0,0),
(34,34,'Engineering','2019-07-01',0,0,0),
(35,35,'Finance',  '2019-05-01',0,0,0),
(36,36,'Database', '2019-02-01',1,1,0),
(37,37,'Engineering','2020-01-01',0,0,0),
(38,38,'IT Ops',   '2019-11-01',1,0,0),
(39,39,'Security', '2020-03-01',1,0,0),
(40,40,'Finance',  '2018-07-01',0,0,0);

CREATE TABLE salary_deposits (
  deposit_id INTEGER PRIMARY KEY,
  emp_id INTEGER, amount REAL,
  deposit_date TEXT, account_bank TEXT
);
INSERT INTO salary_deposits VALUES
(1,10,1700000,'2019-09-01','SBI Main Branch'),
(2,19,1200000,'2019-09-01','HDFC Koramangala'),
(3,31,1180000,'2019-09-01','ICICI Indiranagar'),
(4,36,1160000,'2019-09-01','Axis JP Nagar'),
(5,13,900000,'2019-09-01','HDFC Whitefield'),
(101,10,8500000,'2019-09-15','HSBC Singapore'),
(102,36,6200000,'2019-09-16','DBS Hong Kong'),
(103,31,4800000,'2019-09-14','Standard Chartered Dubai'),
(104,19,5100000,'2019-09-15','UBS Zurich');
`,

// ═══════════════════════════════════════════════════════════════════════════
// CASE 4 — THE VANISHING ACT (Delhi 2015)
// A senior diplomat disappeared the night before key treaty talks.
// Intelligence points to an inside leak. Find the mole.
// ═══════════════════════════════════════════════════════════════════════════
4: `
CREATE TABLE ministry_staff (
  staff_id INTEGER PRIMARY KEY,
  full_name TEXT, designation TEXT,
  department TEXT, clearance TEXT,
  nationality TEXT, years_of_service INTEGER,
  direct_report_to INTEGER
);
INSERT INTO ministry_staff VALUES
(1,'Ambassador Vikram Oberoi','Ambassador','External Affairs','TOP SECRET','Indian',28,NULL),
(2,'Nisha Kulkarni','Joint Secretary','External Affairs','SECRET',            'Indian',18,NULL),
(3,'Rajan Thapar','Deputy Secretary','Political Division','SECRET',           'Indian',14,2),
(4,'Amara Okafor','Cultural Attaché','Cultural Division','CONFIDENTIAL',      'Nigerian',8,2),
(5,'Boris Levin','Trade Counsellor','Economic Division','SECRET',             'Russian',12,2),
(6,'Suresh Pillai','Protocol Officer','Protocol Division','CONFIDENTIAL',     'Indian',10,2),
(7,'Guo Jianming','Press Secretary','Media Division','CONFIDENTIAL',          'Chinese',9,2),
(8,'Meena Rathore','Personal Secretary to Ambassador','Executive','SECRET',   'Indian',16,1),
(9,'Tariq Hassan','Intelligence Liaison','External','TOP SECRET',             'Indian',22,NULL),
(10,'Kavita Singh','Deputy Protocol','Protocol Division','CONFIDENTIAL',      'Indian',6,6),
(11,'Ernst Hoffman','Commerce Advisor','Economic Division','SECRET',          'German',11,2),
(12,'Priya Balan','Administrative Officer','Admin','RESTRICTED',              'Indian',5,2),
(13,'Zhao Lei','Technical Expert','IT Division','SECRET',                     'Chinese',7,2),
(14,'Felix Moreau','Cultural Program Director','Cultural Division','CONFIDENTIAL','French',9,4),
(15,'Laila Ahmadi','Language Interpreter','Language Services','RESTRICTED',   'Iranian',4,2),
(16,'Dmitri Volkov','Security Attaché','Security Division','SECRET',          'Russian',13,9),
(17,'Samuel Achebe','Development Officer','Development','CONFIDENTIAL',       'Ghanaian',6,2),
(18,'Hina Matsuda','Economic Analyst','Economic Division','SECRET',           'Japanese',8,2),
(19,'Alam Khan','Administrative Clerk','Admin','RESTRICTED',                  'Indian',3,12),
(20,'Carla Esposito','Media Relations','Media Division','CONFIDENTIAL',       'Italian',7,7),
(21,'Ivan Petrov','Deputy Security','Security Division','SECRET',             'Russian',10,16),
(22,'Suhana Malik','Code Room Officer','Communications','TOP SECRET',         'Indian',15,9),
(23,'Kweku Mensah','Protocol Assistant','Protocol Division','CONFIDENTIAL',   'Ghanaian',4,6),
(24,'Lena Braun','Trade Specialist','Economic Division','SECRET',             'German',9,11),
(25,'Raj Patel','IT Support','IT Division','RESTRICTED',                      'Indian',4,13),
(26,'Maria Santos','Interpreter','Language Services','RESTRICTED',            'Brazilian',5,2),
(27,'Amir Farhan','Visa Officer','Consular Division','CONFIDENTIAL',          'Indian',8,2),
(28,'Helena Novak','Liaison Officer','Political Division','SECRET',           'Czech',10,3),
(29,'Yusuf Abdi','Finance Officer','Finance','CONFIDENTIAL',                  'Somali',6,2),
(30,'Ingrid Larsen','Information Officer','Media Division','CONFIDENTIAL',    'Norwegian',5,7);

CREATE TABLE building_access_log (
  log_id INTEGER PRIMARY KEY,
  staff_id INTEGER, zone TEXT,
  timestamp TEXT, action TEXT, badge_type TEXT
);
INSERT INTO building_access_log VALUES
(1,9,'SECURE_COMMS_ROOM','2015-04-02 21:15','ENTRY','TOP SECRET'),
(2,22,'SECURE_COMMS_ROOM','2015-04-02 21:17','ENTRY','TOP SECRET'),
(3,9,'SECURE_COMMS_ROOM','2015-04-02 21:45','EXIT','TOP SECRET'),
(4,22,'SECURE_COMMS_ROOM','2015-04-02 22:10','EXIT','TOP SECRET'),
(5,16,'AMBASSADOR_SUITE','2015-04-02 20:00','ENTRY','SECRET'),
(6,21,'AMBASSADOR_SUITE','2015-04-02 20:00','ENTRY','SECRET'),
(7,8,'AMBASSADOR_SUITE','2015-04-02 19:30','ENTRY','SECRET'),
(8,8,'AMBASSADOR_SUITE','2015-04-02 21:00','EXIT','SECRET'),
(9,16,'AMBASSADOR_SUITE','2015-04-02 22:30','EXIT','SECRET'),
(10,21,'AMBASSADOR_SUITE','2015-04-02 23:15','EXIT','SECRET'),
(11,5,'TREATY_DOCS_VAULT','2015-04-02 18:00','ENTRY','SECRET'),
(12,5,'TREATY_DOCS_VAULT','2015-04-02 18:45','EXIT','SECRET'),
(13,28,'TREATY_DOCS_VAULT','2015-04-02 19:00','ENTRY','SECRET'),
(14,28,'TREATY_DOCS_VAULT','2015-04-02 20:15','EXIT','SECRET'),
(15,3,'TREATY_DOCS_VAULT','2015-04-02 20:30','ENTRY','SECRET'),
(16,3,'TREATY_DOCS_VAULT','2015-04-02 21:30','EXIT','SECRET'),
(17,11,'TREATY_DOCS_VAULT','2015-04-02 17:30','ENTRY','SECRET'),
(18,11,'TREATY_DOCS_VAULT','2015-04-02 18:00','EXIT','SECRET'),
(19,1,'AMBASSADOR_SUITE','2015-04-02 17:00','ENTRY','TOP SECRET'),
(20,1,'AMBASSADOR_SUITE','2015-04-02 19:00','EXIT','TOP SECRET'),
(21,9,'AMBASSADOR_SUITE','2015-04-02 22:45','ENTRY','TOP SECRET'),
(22,9,'AMBASSADOR_SUITE','2015-04-02 23:30','EXIT','TOP SECRET'),
(23,13,'IT_SERVER_ROOM','2015-04-02 20:00','ENTRY','SECRET'),
(24,13,'IT_SERVER_ROOM','2015-04-02 23:00','EXIT','SECRET'),
(25,25,'IT_SERVER_ROOM','2015-04-02 20:05','ENTRY','RESTRICTED'),
(26,25,'IT_SERVER_ROOM','2015-04-02 23:05','EXIT','RESTRICTED'),
(27,22,'CIPHER_ROOM','2015-04-02 20:30','ENTRY','TOP SECRET'),
(28,22,'CIPHER_ROOM','2015-04-02 21:00','EXIT','TOP SECRET'),
(29,9,'CIPHER_ROOM','2015-04-02 21:00','ENTRY','TOP SECRET'),
(30,9,'CIPHER_ROOM','2015-04-02 21:14','EXIT','TOP SECRET');

CREATE TABLE encrypted_transmissions (
  msg_id INTEGER PRIMARY KEY,
  sender_id INTEGER, receiver_code TEXT,
  sent_at TEXT, channel TEXT,
  classification TEXT, decoded_summary TEXT
);
INSERT INTO encrypted_transmissions VALUES
(1,22,'EXTERNAL-UNKNOWN','2015-04-02 21:30','CIPHER-7','TOP SECRET','[REDACTED — Under Investigation]'),
(2,9,'HQ-DELHI','2015-04-02 21:50','SECURE-LINK','TOP SECRET','Routine check-in with intelligence HQ'),
(3,5,'MOSCOW-TRADE','2015-04-02 17:55','OPEN-CHANNEL','SECRET','Trade attaché update on bilateral deal'),
(4,3,'MEA-DELHI','2015-04-02 22:00','SECURE-LINK','SECRET','Treaty draft sent for review'),
(5,16,'SECURITY-HQ','2015-04-02 22:00','SECURE-LINK','SECRET','Security protocol check'),
(6,28,'PRAGUE-EMBASSY','2015-04-02 20:10','OPEN-CHANNEL','SECRET','Liaison update'),
(7,11,'BERLIN-TRADE','2015-04-02 17:45','OPEN-CHANNEL','SECRET','Trade stats confirmed'),
(8,13,'VENDOR-TECHCORP','2015-04-02 20:30','OPEN-CHANNEL','SECRET','Server maintenance log'),
(9,22,'EXTERNAL-UNKNOWN','2015-04-02 22:05','CIPHER-7','TOP SECRET','[REDACTED — Under Investigation]'),
(10,25,'VENDOR-TECHCORP','2015-04-02 20:35','OPEN-CHANNEL','RESTRICTED','Helpdesk ticket #4412');

CREATE TABLE diplomatic_meetings (
  meeting_id INTEGER PRIMARY KEY,
  title TEXT, location TEXT,
  scheduled_time TEXT, attendees TEXT, status TEXT
);
INSERT INTO diplomatic_meetings VALUES
(1,'Bilateral Treaty Final Review','Conf Room A','2015-04-03 09:00','1,2,3,5,9,11','CANCELLED — Ambassador Missing'),
(2,'Cultural Exchange MOU Signing','Conf Room B','2015-04-03 11:00','4,14,20','CANCELLED'),
(3,'Trade Framework Discussion','VVIP Lounge','2015-04-03 14:00','2,5,11,18,24','CANCELLED — Ambassador Missing'),
(4,'Security Briefing','Secure Room','2015-04-03 08:00','9,16,21','CANCELLED'),
(5,'Press Conference','Media Hall','2015-04-03 16:00','7,20','CANCELLED — Ambassador Missing');

CREATE TABLE phone_records (
  call_id INTEGER PRIMARY KEY,
  caller_id INTEGER, callee_number TEXT,
  call_time TEXT, duration_sec INTEGER,
  call_type TEXT, flagged INTEGER
);
INSERT INTO phone_records VALUES
(1,22,'+971-50-XXX-XXXX','2015-04-02 21:35',312,'International',1),
(2,22,'+971-50-XXX-XXXX','2015-04-02 22:08',148,'International',1),
(3,9,'+91-11-XXXX-XXXX','2015-04-02 21:52',60,'Domestic',0),
(4,5,'+7-495-XXX-XXXX','2015-04-02 18:00',240,'International',0),
(5,3,'+91-11-XXXX-XXXX','2015-04-02 22:05',120,'Domestic',0),
(6,16,'+91-11-XXXX-XXXX','2015-04-02 22:02',90,'Domestic',0),
(7,28,'+420-2-XXXX-XXXX','2015-04-02 20:12',180,'International',0),
(8,25,'+91-99-XXXX-XXXX','2015-04-02 20:40',45,'Domestic',0),
(9,13,'+91-80-XXXX-XXXX','2015-04-02 20:45',30,'Domestic',0),
(10,8,'+91-11-XXXX-XXXX','2015-04-02 20:50',90,'Domestic',0),
(11,22,'+971-50-XXX-XXXX','2015-04-02 23:00',420,'International',1),
(12,1,'+91-11-XXXX-XXXX','2015-04-02 18:30',60,'Domestic',0);

CREATE TABLE intelligence_reports (
  report_id INTEGER PRIMARY KEY,
  source TEXT, report_date TEXT,
  subject TEXT, risk_level TEXT, summary TEXT
);
INSERT INTO intelligence_reports VALUES
(1,'HUMINT-SOURCE-A','2015-03-15','Foreign interest in treaty terms','HIGH','Foreign intelligence services showing unusual interest in the bilateral treaty terms being negotiated. Potential leak risk from within the delegation.'),
(2,'SIGINT-UNIT-3','2015-03-28','Encrypted transmissions from Delhi','CRITICAL','Two encrypted transmissions detected on unofficial CIPHER-7 channel originating from within the Ministry compound. Source not yet identified.'),
(3,'HUMINT-SOURCE-B','2015-04-01','Compromised staff profile','HIGH','One staff member recently made three unscheduled visits to a foreign consulate. Staff member has access to treaty documents and cipher room.'),
(4,'SIGINT-UNIT-3','2015-04-02','CIPHER-7 channel activity detected','CRITICAL','CIPHER-7 channel activated twice between 21:30 and 22:10 on April 2. Receiver identified as a burner number registered in the UAE. Cross-reference with staff in secure areas at that time.');
`,
};
