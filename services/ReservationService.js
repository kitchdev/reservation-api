import db from "../controllers/pgConnector.js";

/**
 *
 * @param {*} client
 * @param {*} date
 * @returns
 */

const isDateBlocked = async (client, date) => {
  const res = await client.query(
    "SELECT * FROM Blocked_Dates WHERE blocked_date = $1",
    [date]
  );
  return res.rows.length > 0;
};

/**
 *
 * @param {*} client
 * @param {*} date
 * @param {*} time
 * @param {*} duration
 * @returns
 */

const getAvailableLanes = async (client, date, time, duration) => {
  const dayOfWeek = new Date(date).toLocaleString("en-US", { weekday: "long" });

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
  console.log(reservationsRes);
  const reservedLaneIds = reservationsRes.rows.map((row) => row.lane_id);

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
};

/**
 *
 * @param {*} userId
 * @param {*} date
 * @param {*} time
 * @param {*} duration
 * @param {*} laneIds
 * @returns
 */

const reservationService = async (userId, date, time, duration, laneIds) => {
  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    if (await isDateBlocked(client, date)) {
      throw new Error("The selected date is blocked.");
    }

    const availableLanes = await getAvailableLanes(
      client,
      date,
      time,
      duration
    );
    console.log(availableLanes);
    const availableLaneIds = availableLanes.map((lane) => lane.id);
    console.log(laneIds);
    if (!laneIds.every((laneId) => availableLaneIds.includes(laneId))) {
      throw new Error("One or more lanes are not available.");
    }

    const reservationRes = await client.query(
      `INSERT INTO Reservations (user_id, reservation_date, reservation_time, duration_minutes)
          VALUES ($1, $2, $3, $4) RETURNING id`,
      [userId, date, time, duration]
    );

    const reservationId = reservationRes.rows[0].id;

    for (const laneId of laneIds) {
      await client.query(
        `INSERT INTO Reservation_Lanes (reservation_id, lane_id)
              VALUES ($1, $2)`,
        [reservationId, laneId]
      );
    }

    await client.query("COMMIT");
    return reservationId;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export default reservationService;
