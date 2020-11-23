import express from "express";
import { bookingRoutes } from "../../module/booking/booking.routes";
import { crudRoutes } from "../../module/crud/crud.routes";
import { roomRoutes } from "../../module/room/room.routes";

const apiRoutes = express.Router();

apiRoutes.get("/", function(req, res, next) {
  res.json({ message: "Booking a hotel has never been easier" });
});

apiRoutes.use("/auth", crudRoutes);
apiRoutes.use("/booking", bookingRoutes);
apiRoutes.use("/room", roomRoutes);

export default apiRoutes;
