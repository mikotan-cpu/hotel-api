import express from "express";
import roomController from "./room.controller";
import { asyncWrapper } from "../../utils/asyncWrapper";
import authenticateToken from "../../middleware/auth";
import isAdmin from "../../middleware/isAdmin";
import onlyOwner from "../../middleware/onlyOwner";

const roomRoutes = express.Router();

roomRoutes.get("/", function(req, res, next) {
  res.json({ message: "for room" });
});

// Create
roomRoutes.post("/add", [authenticateToken,isAdmin], asyncWrapper(roomController.add));

// edit
roomRoutes.put("/edit/:roomID", [authenticateToken, isAdmin], asyncWrapper(roomController.update));

//assign
roomRoutes.get("/assign/:roomID/:bookingID", [authenticateToken,isAdmin], asyncWrapper(roomController.assign));

// delete
roomRoutes.delete("/delete/:roomID", [authenticateToken, isAdmin], asyncWrapper(roomController.delete));

// list all
roomRoutes.get("/findAll", [authenticateToken], asyncWrapper(roomController.findAll));

// view one 
roomRoutes.get("/findOne/:roomID", [authenticateToken], asyncWrapper(roomController.findOne));
export { roomRoutes };

