import getTimeSlotAvailability from "../services/TimeSlotAvailabilityService.js";

async function getTimeSlots(req, res) {
  const { date, noLanes } = req.query;
  try {
    const results = await getTimeSlotAvailability(date, noLanes);
    res.status(200).send(results);
  } catch (err) {
    console.error(err.message);
    res.status(err.code || 500).send(err.message);
  }
}

export default getTimeSlots;
