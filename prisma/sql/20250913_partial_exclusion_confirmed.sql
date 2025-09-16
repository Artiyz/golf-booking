CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS "booking_no_overlap";

ALTER TABLE "Booking"
ADD CONSTRAINT "booking_no_overlap"
EXCLUDE USING gist (
  "bayId" WITH =,
  tstzrange("startTime","endTime",'[)') WITH &&
)
WHERE ("status" = 'CONFIRMED');
