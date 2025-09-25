-------------------------------------------------------
--------------------------------------------------
-- START FROM SCRATCH:
DROP TABLE IF EXISTS "favorite_adventures";
DROP TABLE IF EXISTS "adventures";
DROP TABLE IF EXISTS "cost_table";
DROP TABLE IF EXISTS "ability_table";
DROP TABLE IF EXISTS "category_table";
DROP TRIGGER IF EXISTS "on_user_update" ON "user";
DROP TABLE IF EXISTS "user";

-------------------------------------------------------
--------------------------------------------------
-- TABLE SCHEMAS:
CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR (80) UNIQUE NOT NULL,
  "password" VARCHAR (1000) NOT NULL,
  "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AUTOMAGIC UPDATED_AT:
CREATE OR REPLACE FUNCTION set_updated_at_to_now()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_update
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();

-- CREATE CATEGORY TABLE
CREATE TABLE "category_table" (
	"id" serial NOT NULL UNIQUE,
	"category_name" VARCHAR(255) NOT NULL,
	PRIMARY KEY ("id")
);

-- CREATE ABILITY LEVEL TABLE
CREATE TABLE "ability_table" (
	"id" serial NOT NULL UNIQUE,
	"ability_level" VARCHAR NOT NULL,
	PRIMARY KEY ("id")
);

-- CREATE COST LEVEL TABLE
CREATE TABLE "cost_table" (
	"id" serial NOT NULL UNIQUE,
	"cost_level" VARCHAR NOT NULL,
	PRIMARY KEY ("id")
);

-- CREATE ADVENTURE TABLE (with address column)
CREATE TABLE "adventures" (
	"id" serial NOT NULL UNIQUE,
	"activity_name" VARCHAR(255) NOT NULL,
	"category_id" INTEGER NOT NULL REFERENCES "category_table"(id),
	"ability_level_id" INTEGER NOT NULL REFERENCES "ability_table"(id),
	"cost_level_id" INTEGER NOT NULL REFERENCES "cost_table"(id),
	"photo" VARCHAR(255),
	"link" VARCHAR(300) NOT NULL,
	"description" TEXT NOT NULL,
	"city" VARCHAR(255),
	"state" VARCHAR(255),
	"zip" VARCHAR(255),
	"address" VARCHAR(500),
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"created_by" INTEGER NOT NULL REFERENCES "user"(id),
	"status" VARCHAR(255) NOT NULL DEFAULT 'pending',
	PRIMARY KEY ("id")
);

-- CREATE FAVORITE ADVENTURES TABLE
CREATE TABLE "favorite_adventures" (
	"id" serial NOT NULL UNIQUE,
	"user_id" INTEGER NOT NULL REFERENCES "user"(id),
	"adventure_id" INTEGER NOT NULL REFERENCES "adventures"(id),
	PRIMARY KEY ("id")
);

-- INSERT DATA FOR CATEGORY TABLE
INSERT INTO "category_table" ("category_name") VALUES
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

-- INSERT DATA FOR ABILITY TABLE
INSERT INTO "ability_table" ("ability_level") VALUES
('Very Easy'),
('Easy'),
('Moderate'),
('Hard'),
('Very Challenging');

-- INSERT DATA FOR COST TABLE
INSERT INTO "cost_table" ("cost_level") VALUES
('Free'),
('Low'),
('Moderate'),
('High'),
('Very High');
