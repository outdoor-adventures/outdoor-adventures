-------------------------------------------------------
--------------------------------------------------
-- START FROM SCRATCH:
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


-------------------------------------------------------
--------------------------------------------------
-- SEED DATA:
--   You'll need to actually register users via the application in order to get hashed
--   passwords. Once you've done that, you can modify this INSERT statement to include
--   your dummy users. Be sure to copy/paste their hashed passwords, as well.
--   This is only for development purposes! Here's a commented-out example:
-- INSERT INTO "user"
--   ("username", "password")
--   VALUES
--   ('unicorn10', '$2a$10$oGi81qjXmTh/slGzYOr2fu6NGuCwB4kngsiWQPToNrZf5X8hxkeNG'), --pw: 123
--   ('cactusfox', '$2a$10$8./c/6fB2BkzdIrAUMWOxOlR75kgmbx/JMrMA5gA70c9IAobVZquW'); --pw: 123


-------------------------------------------------------
--------------------------------------------------
-- AUTOMAGIC UPDATED_AT:

-- Did you know that you can make and execute functions
-- in PostgresQL? Wild, right!? I'm not making this up. Here
-- is proof that I am not making this up:
  -- https://x-team.com/blog/automatic-timestamps-with-postgresql/

-- Create a function that sets a row's updated_at column
-- to NOW():
CREATE OR REPLACE FUNCTION set_updated_at_to_now() -- 👈
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger on the user table that will execute
-- the set_update_at_to_now function on any rows that
-- have been touched by an UPDATE query:
CREATE TRIGGER on_user_update
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();




--CREATE CATEGORY TABLE

CREATE TABLE IF NOT EXISTS "category_table" (
	"id" serial NOT NULL UNIQUE,
	"category_name" VARCHAR(255) NOT NULL,
	PRIMARY KEY ("id")
);



--ADD DATA FOR CATEGORY TABLE

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



--ADD DATA FOR ABILITY TABLE

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



--ADD DATA FOR COST TABLE

INSERT INTO "cost_table"
("cost_level")
VALUES
('Free'),
('Low'),
('Moderate'),
('High'),
('Very High');



--CREATE ADVENTURE TABLE

CREATE TABLE IF NOT EXISTS "adventures" (
	"id" serial NOT NULL UNIQUE,
	"activity_name" VARCHAR(255) NOT NULL,
	"category_id" INTEGER NOT NULL REFERENCES "category_table"(id),
	"ability_level_id" INTEGER NOT NULL REFERENCES "ability_table"(id),
	"cost_level_id" INTEGER NOT NULL REFERENCES "cost_table"(id),
	"photo" VARCHAR(255) NOT NULL,
	"link" VARCHAR(300) NOT NULL,
	"description" VARCHAR(255) NOT NULL,
	"city" VARCHAR(255) NOT NULL,
	"state" VARCHAR(255) NOT NULL,
	"zip" VARCHAR(255) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
	"created_by" INTEGER NOT NULL REFERENCES "user"(id),
	"status" VARCHAR(255) NOT NULL,
	PRIMARY KEY ("id")
);

-----------------------------------------------------------------------------------------------------------------------

--BEFORE MOVING FORWARD WITH EXECUTING THE NEXT STATEMENT, RUN THE APP IN YOUR BROWSER AND REGISTER A NEW USER.  

-- VISIT THE REGISTER PAGE AND INPUT THE EMAIL ADDRESS YOU WANT TO USE, THEN CREATE A PASSWORD. 

-- ONCE THE LOGIN/PASSWORD ARE INPUT - SELECT THE REGISTER BUTTON TO COMPLETE THE CREATION OF THE NEW USER. 

-----------------------------------------------------------------------------------------------------------------------




-- CREATE THE ADVENTURE TABLE SAMPLE VALUES

INSERT INTO "adventures" 
("activity_name", "category_id", "ability_level_id", "cost_level_id", "photo",
 "link", "description", "city", "state", "zip", "latitude", "longitude", "created_by", "status")
VALUES
('Banks-Vernonia State Trail', 1, 1, 2, 'img.png', 'https://www.oregonstateparks.org/parks/banks-vernonia', 'Scenic 21-mile rail-trail through forests', 'Banks', 'Oregon', '97106', 45.72421, -123.18574, 1, 'approved'),
('Silver Falls State Park', 1, 1, 1, 'img.png', 'https://stateparks.oregon.gov/camping', 'Beautiful waterfall hikes and campsites', 'Silverton', 'Oregon', '97381', 44.939485, -122.720739, 1, 'approved'),
('Deschutes River', 4, 1, 2, 'img.png', 'https://www.visitbend.com/things-to-do/outdoor-activities/', 'Popular for rafting, kayaking, and tubing', 'Bend', 'Oregon', '97701', 44.058174, -121.315308, 1, 'approved'),
('Columbia River', 5, 1, 2, 'img.png', 'https://www.gonw.com/', 'Known for salmon fishing and scenic river views', 'Columbia River Gorge', 'Oregon', '97031', 45.7028, -121.7883, 1, 'approved'),
('Glacier National Park', 17, 1, 1, 'img.png', 'https://www.nps.gov/glac/index.htm', 'Stunning mountain views and alpine lakes', 'West Glacier', 'Montana', '59936', 48.525, -113.98361, 1, 'approved'),
('Going-to-the-Sun Road', 2, 1, 4, 'img.png', 'https://www.nps.gov/glac/planyourvisit/', 'Scenic, challenging bike route in the park', 'West Glacier', 'Montana', '59936', 48.695, -113.817, 1, 'approved'),
('Yellowstone National Park', 3, 1, 2, 'img.png', 'https://www.nps.gov/yell/index.htm', 'Iconic park with diverse ecosystems and campsites', 'Yellowstone', 'Montana', '59758', 44.446037, -110.587349, 1, 'approved'),
('Missouri River', 4, 1, 2, 'img.png', 'https://www.visitmt.com/listings/general/activities/', 'Canoeing and kayaking through scenic river canyons', 'Great Falls', 'Montana', '59401', 47.5, -111.3, 1, 'approved'),
('Flathead Lake', 5, 1, 2, 'img.png', 'https://flatheadlakesportsfishing.com/', 'Great for fishing and water sports', 'Polson', 'Montana', '59860', 47.6936, -114.1638, 1, 'approved'),
('Sawtooth National Recreation Area', 1, 1, 2, 'img.png', 'https://www.fs.usda.gov/recarea/sawtooth/recarea/?recid=5930', 'Rugged mountain trails with lakes and forests', 'Ketchum', 'Idaho', '83353', 43.8978, -114.3783, 1, 'approved'),
('Boise River Greenbelt', 1, 1, 2, 'img.png', 'https://www.cityofboise.org/departments/parks-and-recreation/', 'Scenic trail along the Boise River', 'Boise', 'Idaho', '83702', 43.615, -116.2023, 1, 'approved'),
('Coeur d''Alene National Forest', 3, 1, 1, 'img.png', 'https://www.fs.usda.gov/cda/', 'Lakeside campsites in a dense forest', 'Coeur d''Alene', 'Idaho', '83814', 47.6777, -116.7805, 1, 'approved'),
('Snake River', 4, 1, 2, 'img.png', 'https://www.visitidaho.org/things-to-do/outdoor-activities/', 'Rafting and kayaking through canyons and rapids', 'Twin Falls', 'Idaho', '83301', 42.5629, -114.4609, 1, 'approved'),
('Henry''s Lake', 5, 1, 2, 'img.png', 'https://www.idahofishandgame.org/', 'Excellent trout fishing in a scenic mountain lake', 'Island Park', 'Idaho', '83429', 44.6266, -111.4183, 1, 'approved'),
('Red Rock Canyon National Conservation Area', 1, 1, 2, 'img.png', 'https://www.redrockcanyonlv.org/', 'Scenic desert hiking with stunning rock formations', 'Las Vegas', 'Nevada', '89161', 36.135, -115.427, 1, 'approved'),
('Tahoe Rim Trail', 2, 1, 4, 'img.png', 'https://www.tahoerimtrail.org/', 'Challenging mountain biking trail around Lake Tahoe', 'Incline Village', 'Nevada', '89451', 39.25, -119.972, 1, 'approved'),
('Lake Mead National Recreation Area', 3, 1, 2, 'img.png', 'https://www.nps.gov/lake/index.htm', 'Campsites near the lake with hiking and boating opportunities', 'Boulder City', 'Nevada', '89005', 36.0162, -114.7377, 1, 'approved'),
('Truckee River', 4, 1, 2, 'img.png', 'https://www.visitrenotahoe.com/things-to-do/rafting-kayaking', 'Popular for rafting and kayaking in the scenic Truckee River', 'Reno', 'Nevada', '89501', 39.5296, -119.8138, 1, 'approved'),
('Pyramid Lake', 5, 1, 4, 'img.png', 'https://www.pyramidlake.us/', 'Known for world-class trout fishing', 'Nixon', 'Nevada', '89424', 39.8366, -119.6018, 1, 'approved'),
('Mark Twain National Forest', 1, 1, 2, 'img.png', 'https://www.fs.usda.gov/marktwain', 'Scenic forest trails and wildlife', 'Rolla', 'Missouri', '65401', 37.95, -91.7715, 1, 'approved'),
('Katy Trail State Park', 2, 1, 2, 'img.png', 'https://mostateparks.com/park/katy-trail-state-park', 'Longest rail-trail in Missouri', 'Jefferson City', 'Missouri', '65101', 38.5767, -92.1735, 1, 'approved'),
('Cuivre River State Park', 3, 1, 1, 'img.png', 'https://mostateparks.com/park/cuivre-river-state-park', 'Secluded campsites near lakes', 'Troy', 'Missouri', '63379', 38.9792, -90.9801, 1, 'approved'),
('Ozark National Scenic Riverways', 4, 1, 2, 'img.png', 'https://www.nps.gov/ozar/index.htm', 'Paddling and tubing in the Ozarks', 'Van Buren', 'Missouri', '63965', 36.9931, -91.0151, 1, 'approved'),
('Lake of the Ozarks', 5, 1, 2, 'img.png', 'https://www.lakeoftheozarks.com/fishing/', 'Excellent bass fishing', 'Osage Beach', 'Missouri', '65065', 38.1298, -92.6386, 1, 'approved'),
('Ouachita National Forest', 1, 1, 2, 'img.png', 'https://www.fs.usda.gov/ouachita', 'Scenic trails through forests and mountains', 'Hot Springs', 'Arkansas', '71901', 34.5037, -93.0552, 1, 'approved'),
('Arkansas High Country Trail', 2, 1, 4, 'img.png', 'https://www.arkansas.com/things-to-do/activities/biking', 'Challenging mountain bike trails', 'Fayetteville', 'Arkansas', '72701', 36.0626, -94.1574, 1, 'approved'),
('Petit Jean State Park', 3, 1, 2, 'img.png', 'https://www.arkansasstateparks.com/petitjean', 'Scenic camping with waterfalls and hiking', 'Morrilton', 'Arkansas', '72110', 35.1262, -92.7443, 1, 'approved'),
('Crater Lake National Park', 1, 1, 2, 'img.png', 'https://www.nps.gov/crla/index.htm', 'Stunning views and rim hikes around the lake', 'Crater Lake', 'Oregon', '97604', 42.944611, -122.109245, 1, 'approved');


-- CREATE THE FAVORITE ADVENTURES TABLE
  
CREATE TABLE IF NOT EXISTS "favorite_adventures" (
	"id" serial NOT NULL UNIQUE,
	"user_id" INTEGER NOT NULL REFERENCES "user"(id),
	"adventure_id" INTEGER NOT NULL REFERENCES "adventures"(id),
	PRIMARY KEY ("id")
);

--CREATE NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
	"id" serial NOT NULL UNIQUE,
	"email" VARCHAR(255) NOT NULL,
	"name" VARCHAR(255) NOT NULL,
	"subscribed_on" TIMESTAMPTZ DEFAULT now(),
	"user_id" INTEGER REFERENCES "user"(id),	
	PRIMARY KEY ("id")
);