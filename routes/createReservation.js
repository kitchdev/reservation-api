import reservationService from "../services/ReservationService.js";

// userId, date, time, duration, laneIds
async function createReservation(req, res) {
  const { userId, date, time, duration, laneIds } = req.body;
  try {
    const reservationId = await reservationService(
      userId,
      date,
      time,
      duration,
      laneIds
    );
    res.status(200).send(`reservation ${reservationId} created`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err);
  }
}

export default createReservation;
