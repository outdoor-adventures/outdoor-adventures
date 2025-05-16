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

--CREATE ADVENTURE TABLE
--adventure table
	CREATE TABLE IF NOT EXISTS "adventures" (
	"id" serial NOT NULL UNIQUE,
	"activity_name" VARCHAR(255) NOT NULL,
	"category_id" INTEGER NOT NULL,
	"ability_level_id" INTEGER NOT NULL,
	"cost_level_id" INTEGER NOT NULL,
	"photo" VARCHAR(255) NOT NULL,
	"link" VARCHAR(255),
	"description" VARCHAR(255),
	"city" VARCHAR(255) NOT NULL,
	"state" VARCHAR(255) NOT NULL,
	"zip" VARCHAR(255) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"created_by" INTEGER NOT NULL,
	"status" VARCHAR(255) NOT NULL,
	PRIMARY KEY ("id")
);

--ADVENTURE TABLE SAMPLE VALUES
INSERT INTO "adventures" 
("activity_name", "category_id", "ability_level_id", "cost_level_id", "photo",
 "link", "description", "city", "state", "zip", "latitude", "longitude", "created_by", "status")
VALUES 
('mount kato', '1', '1', '1', 'img.png', 'https://mountkato.com', 
'Easy Ski runs. not busy on weekdays.', 'mankato', 'minnesota', '56001', '44.1331', '94.0334', '1', 'pending'),
('jay cooke state park', '2', '1', '3', 'img.png',
 'https://www.dnr.state.mn.us/state_parks/park.html?id=spk00187#homepage',
  'pretty park. nice camper cabins', 'carlton', 'minnesota', '55718', '46.6523', '92.3503', '3', 'accepted'),
('Split rock lighthouse', '1', '2', '3', 'img.png',
 'https://www.mnhs.org/splitrock?location=splitrock', 'Super pretty in the fall!',
  'Two harbors', 'minnesota', '55802', '46.711681', '-92.007843', '2', 'canceled');
