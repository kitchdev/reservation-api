import { Router } from "express";
import createReservation from "./createReservation.js";
import getLaneAvailability from "./getLaneAvailability.js";

const router = Router();

router.get("/get-lane-availability", getLaneAvailability);
router.post("/create-reservation", createReservation);

export default router;
