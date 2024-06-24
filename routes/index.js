import { Router } from "express";
import createReservation from "./createReservation.js";
import getLaneAvailability from "./getLaneAvailability.js";
import getTimeSlots from "./getTimeSlotAvailability.js";

const router = Router();

router.get("/get-time-slots", getTimeSlots);
router.get("/get-lane-availability", getLaneAvailability);
router.post("/create-reservation", createReservation);

export default router;
