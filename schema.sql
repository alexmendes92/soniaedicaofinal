DROP TABLE IF EXISTS site_config;
CREATE TABLE site_config (id INTEGER PRIMARY KEY DEFAULT 1, ownerName TEXT, professionTitle TEXT, heroBio TEXT, whatsapp TEXT, primaryColor TEXT);
INSERT INTO site_config (id, ownerName, professionTitle, heroBio, whatsapp, primaryColor) VALUES (1, 'Sônia Andrade', 'Psicanalista', 'Boas vindas...', '552199999999', 'pink');

DROP TABLE IF EXISTS services;
CREATE TABLE services (id TEXT PRIMARY KEY, title TEXT, desc TEXT, icon TEXT, img TEXT, category TEXT);