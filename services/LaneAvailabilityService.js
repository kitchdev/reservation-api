import db from "../controllers/pgConnector.js";
import isDateBlocked from "../helpers/isDateBlocked.js";

/**
 *
 * @param {string} date
 * @param {string} time
 * @param {int} duration
 * @returns
 */

const getLaneAvailability = async (date, time, duration) => {
  const client = await db.pool.connect();

  try {
    if (await isDateBlocked(client, date)) {
      return "The selected date is blocked.";
    }
    const dayOfWeek = new Date(date).toLocaleString("en-US", {
      weekday: "long",
    });
    console.log({ dayOfWeek });
    const availabilityRes = await client.query(
      `SELECT * FROM Availability
          WHERE day_of_week = $1 AND start_time <= $2 AND end_time >= ($2 + $3::interval)`,
      [dayOfWeek, time, `${duration} minutes`]
    );

    if (availabilityRes.rows.length === 0) {
      return [];
    }

    const reservationsRes = await client.query(
      `SELECT lane_id FROM Reservations r
          JOIN Reservation_Lanes rl ON r.id = rl.reservation_id
          WHERE reservation_date = $1 AND
          (($2::time, ($2::time + $3::interval)) OVERLAPS (reservation_time, (reservation_time + (r.duration_minutes || ' minutes')::interval)))`,
      [date, time, `${duration} minutes`]
    );

    console.log({ reservationsRes: reservationsRes.rows });

    const reservedLaneIds = reservationsRes.rows.map((row) => row.lane_id);
    console.log(reservedLaneIds);

    let query = "SELECT * FROM Lanes";
    const queryParams = [];
    if (reservedLaneIds.length > 0) {
      query +=
        " WHERE id NOT IN (" +
        reservedLaneIds.map((_, i) => `$${i + 1}`).join(", ") +
        ")";
      queryParams.push(...reservedLaneIds);
    }

    const availableLanesRes = await client.query(query, queryParams);

    return availableLanesRes.rows;
  } catch (err) {
    console.error(err.message);
    throw new Error("error in laneAvailabilityService");
  } finally {
    client.release();
  }
};

export default getLaneAvailability;
