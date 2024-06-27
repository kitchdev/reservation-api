import db from "../controllers/pgConnector.js";
import isDateBlocked from "../helpers/isDateBlocked.js";
import get30MinIntervals from "../helpers/get30MinuteIntervals.js";

/**
 *
 * @param {string} date
 * @param {int} noLanes
 */

const getTimeSlotAvailability = async (date, noLanes) => {
  const client = await db.pool.connect();
  try {
    if (await isDateBlocked(client, date)) {
      return "The selected date is blocked";
    }
    const dayOfWeek = new Date(date).toLocaleString("en-US", {
      weekday: "long",
    });

    const availabilityRes = await client.query(
      `SELECT * FROM Availability
          WHERE day_of_week = $1`,
      [dayOfWeek]
    );

    if (availabilityRes.rows.length === 0) {
      return [];
    }

    const availabilityTimeSlots = availabilityRes.rows.reduce((acc, slot) => {
      acc.push(...get30MinIntervals(slot.start_time, slot.end_time));
      return acc;
    }, []);

    const { rows } = await client.query(
      `SELECT reservation_time, reservation_endtime, duration_minutes, number_of_lanes FROM Reservations r
          WHERE reservation_date = $1`,
      [date]
    );
    console.log(rows);

    // pretty non-performant, but atleast we no n of availabletimeslots won't be too large
    const availabilityTimeHash = availabilityTimeSlots.map((timeSlot) => {
      const newSlot = { [timeSlot]: 8 };
      for (let i = 0; i < rows.length; i++) {
        if (
          timeSlot >= rows[i].reservation_time &&
          timeSlot < rows[i].reservation_endtime
        ) {
          newSlot[timeSlot] = newSlot[timeSlot] - rows[i].number_of_lanes;
        }
      }
      return newSlot;
    });

    // we need to get the currently filled timeslots from reservations and remove them from availabilityTimeSlots
    // might need to refactor so that reservation table has a list of lane_ids instead of using the reservation_lane table

    console.log(availabilityTimeHash);
    return availabilityTimeHash;
  } catch (err) {
    console.error(err.message);
    throw new Error("error in timeSlotAvailabilityService");
  } finally {
    client.release();
  }
};

export default getTimeSlotAvailability;
