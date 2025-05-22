
--CREATE USER TABLE
CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR (80) UNIQUE NOT NULL,
  "email" VARCHAR (80),
  "password" VARCHAR (1000) NOT NULL,
  "user_rank" INTEGER DEFAULT 0,
  "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

--CREATE CATEGORY TABLE
CREATE TABLE IF NOT EXISTS "category_table" (
	"id" serial NOT NULL UNIQUE,
	"category_name" VARCHAR(255) NOT NULL,
	PRIMARY KEY ("id")
);

--ADD SAMPLE CATEGORIES
INSERT INTO "category_table"
	("category_name")
	VALUES
	('Hiking & Nature Walks'),
	('Biking'),
	('Camping'),
	('Paddling'),
	('Fishing'),
	('Snow Activities'),
	('Nature Scavenger Hunts'),
	('Horseback Riding'),
	('Wildlife Watching'),
	('Climbing & Bouldering'),
	('Stargazing'),
	('Picnicking'),
	('Backyard Bonfires'),
	('Dog-Friendly Adventures'),
	('Playgrounds & Nature Play Areas'),
	('Adventure Parks & Ropes Courses'),
	('Beach & Lake Days'),
	('Farm Visits & Corn Mazes'),
	('Foraging & Plant ID'),
	('Geocashing');

--CREATE ABILITY LEVEL TABLE
CREATE TABLE IF NOT EXISTS "ability_table" (
	"id" serial NOT NULL UNIQUE,
	"ability_level" VARCHAR NOT NULL,
	PRIMARY KEY ("id")
);

--ADD SAMPLE LEVELS
	INSERT INTO "ability_table"
	("ability_level")
	VALUES
	('Very Easy'),
	('Easy'),
	('Moderate'),
	('Hard'),
	('Very Challenging');

--CREATE COST LEVEL TABLE
CREATE TABLE IF NOT EXISTS "cost_table" (
	"id" serial NOT NULL UNIQUE,
	"cost_level" VARCHAR NOT NULL,
	PRIMARY KEY ("id")
);

--ADD SAMPLE LEVELS
INSERT INTO "cost_table"
	("cost_level")
	VALUES
	('Free'),
	('Low: $5-$15'),
	('Moderate: $15-$40'),
	('High: $40-$80'),
	('Very High: $80+');



--CREATE ADVENTURE TABLE
CREATE TABLE IF NOT EXISTS "adventures" (
	"id" serial NOT NULL UNIQUE,
	"activity_name" VARCHAR(255),
	"category_id" INTEGER REFERENCES "category_table"(id),
	"ability_level_id" INTEGER REFERENCES "ability_table"(id),
	"cost_level_id" INTEGER REFERENCES "cost_table"(id),
	"photo" VARCHAR(255),
	"link" VARCHAR(255),
	"description" VARCHAR(255),
	"address" VARCHAR(255),
	"latitude" DECIMAL,
	"longitude" DECIMAL,
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"created_by" INTEGER REFERENCES "user"(id),
	"status" VARCHAR(255),
	PRIMARY KEY ("id")
);


--ADVENTURE TABLE SAMPLE VALUES
INSERT INTO "adventures" 
("activity_name", "category_id", "ability_level_id", "cost_level_id", "photo", "link", "description", "address", "latitude", "longitude", "created_by", "status")
VALUES ('Mount Kato', '6', '1', '3', 'img.png', 'https://mountkato.com', 'Easy Ski runs. not busy on weekdays.', '20461 State Hwy 66, Mankato, MN 56001', '44.1331', '-94.0334', '1', 'pending'),
('Jay Cooke State Park', '3', '2', '2', 'img.png', 'https://www.dnr.state.mn.us/state_parks/park.html?id=spk00187#homepage', 'pretty park. nice camper cabins', '780 E Hwy 210, Carlton, MN 55718', '46.6523', '-92.3503', '3', 'accepted'),
('Split Rock Lighthouse', '1', '2', '2', 'img.png', 'https://www.mnhs.org/splitrock?location=splitrock', 'Super pretty in the fall!', '3713 Split Rock Lighthouse Rd, Two Harbors, MN 55616', '47.2000', '-91.3670', '2', 'accepted');


--CREATE FAVORITE ADVENTURES TABLE
CREATE TABLE IF NOT EXISTS "favorite_adventures" (
	"id" serial NOT NULL UNIQUE,
	"user_id" INTEGER NOT NULL REFERENCES "user"(id),
	"adventure_id" INTEGER NOT NULL REFERENCES "adventures"(id),
	PRIMARY KEY ("id")
);