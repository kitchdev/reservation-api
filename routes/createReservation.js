import PgConnector from "../controllers/pgConnector.js";

// worth maybe doing zod here to validate post body

async function createReservation(req, res) {
  const body = req.body;
  try {
    const pgConnector = new PgConnector();
    const results = await pgConnector.createReservation(body);
    res.status(200).send(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err);
  }
}

export default createReservation;
