import PgConnector from "../controllers/pgConnector.js";

async function getUsers(req, res) {
  try {
    const pgConnector = new PgConnector();
    const rows = await pgConnector.getUsers();
    console.log("=-=--=-=-=-=", pgConnector.printUser());
  } catch (err) {
    if (err) {
      console.error(err.message);
      res.status(500).send(err);
    }
  }
}

export default getUsers;
