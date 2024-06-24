import { Router } from "express";
import getUsers from "./getUsers.js";
import createReservation from "./createReservation.js";

const router = Router();

router.get("/", (req, res) => {
  console.log(req);
  res.send("Hello, World!");
});

router.get("/get-users", getUsers);

router.post("/create-reservation", createReservation);

export default router;
