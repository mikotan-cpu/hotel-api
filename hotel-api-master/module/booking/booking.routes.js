import express from "express";
import bookingController from "./booking.controller";
import { asyncWrapper } from "../../utils/asyncWrapper";
import authenticateToken from "../../middleware/auth";
import isAdmin from "../../middleware/isAdmin";
import onlyOwner from "../../middleware/onlyOwner";

const bookingRoutes = express.Router();

bookingRoutes.get("/", function(req, res, next) {
  res.json({ message: "for booking" });
});

// Create
bookingRoutes.post("/add", [authenticateToken], asyncWrapper(bookingController.add));

//assign
bookingRoutes.post("/assign/:roomID/:bookingID", [authenticateToken,isAdmin], asyncWrapper(bookingController.assign));





// edit
bookingRoutes.put("/edit/:bookingID", [authenticateToken], asyncWrapper(bookingController.update));

// delete
bookingRoutes.delete("/delete/:bookingID", [authenticateToken], asyncWrapper(bookingController.delete));

// list all
bookingRoutes.get("/findAll", [authenticateToken], asyncWrapper(bookingController.findAll));

// view one 
bookingRoutes.get("/findOne/:bookingID", [authenticateToken], asyncWrapper(bookingController.findOne));
export { bookingRoutes };

