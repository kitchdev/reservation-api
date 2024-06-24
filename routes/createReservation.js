import reservationService from "../services/ReservationService.js";

// userId, date, time, duration, laneIds
async function createReservation(req, res) {
  const { userId, date, time, duration, laneIds } = req.body;
  try {
    const reservation = await reservationService(
      userId,
      date,
      time,
      duration,
      laneIds
    );
    res.status(200).send(reservation);
  } catch (err) {
    console.error(err.message);
    res.status(err.code || 500).send(err.message);
  }
}

export default createReservation;
