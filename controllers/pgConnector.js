import dotenv from "dotenv";
import pg from "pg";
const { Client } = pg;

dotenv.config();

// forget the pool, turn it back to a transactional query so we can check if everything jives before committing the query.
// also lets reformat this to a class so we can have a single instance;

class PgConnector {
  constructor() {
    this.client = new Client({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
    });
    this.user = null;
  }
  async getUsers() {
    await this.client.connect();
    try {
      const { rows } = await this.client.query(`SELECT * FROM public.users`);
      this.user = rows[0];
      return rows;
    } catch (err) {
      console.error(err.message);
      throw err;
    } finally {
      this.client.end();
    }
  }

  printUser() {
    return this.user;
  }

  // here we can use a helper to do logic to determine the available timeslots given a date.
  async getAvailableTimeSlots() {}
  // for create reservation we'll use a transcational query
  async createReservation() {}
}

export default PgConnector;
