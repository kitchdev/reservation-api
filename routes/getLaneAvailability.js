import getAvailableLanes from "../services/LaneAvailabilityService.js";

async function getAvailability(req, res) {
  try {
    const { date, time, duration } = req.query;
    const results = await getAvailableLanes(date, time, duration);
    res.status(200).send(results);
  } catch (err) {
    console.error(err.message);
    res.status(error.code || 500).send(err);
  }
}

export default getAvailability;
