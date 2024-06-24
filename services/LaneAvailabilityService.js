import db from "../controllers/pgConnector.js";

const isDateBlocked = async (client, date) => {
  const res = await client.query(
    "SELECT * FROM Blocked_Dates WHERE blocked_date = $1",
    [date]
  );
  return res.rows.length > 0;
};

/**
 *
 * @param {*} date
 * @param {*} time
 * @param {*} duration
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
    console.log({ availabilityRes: availabilityRes.rows });

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
  } finally {
    client.release();
  }
};

export default getLaneAvailability;
