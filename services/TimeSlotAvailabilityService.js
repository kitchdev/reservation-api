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

    const reservationsRes = await client.query(
      `SELECT reservation_time, duration_minutes, number_of_lanes FROM Reservations r
          WHERE reservation_date = $1`,
      [date]
    );

    // we need to get the currently filled timeslots from reservations and remove them from availabilityTimeSlots
    // might need to refactor so that reservation table has a list of lane_ids instead of using the reservation_lane table
    console.log({ reservationsRes: reservationsRes.rows });

    console.log(availabilityTimeSlots);
    return availabilityTimeSlots;
  } catch (err) {
    console.error(err.message);
    throw new Error("error in timeSlotAvailabilityService");
  } finally {
    client.release();
  }
};

export default getTimeSlotAvailability;
