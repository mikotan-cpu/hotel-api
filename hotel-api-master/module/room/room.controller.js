import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { roomModel } from "./room.model";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";

const roomController = {};

// Add room
roomController.add = async (req, res, next) => {
  //
  const {  cost, capacity } = req.body;

  try {
    const room = await roomModel.create({
      cost,
      capacity,
     // bookingID: req.booking.bookingID,
    });

    await room.save();

    res.json(room);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};
// Get All rooms 
roomController.findAll = async (req, res) => {
  try {
    let room = await roomModel.find();
    return res.json(room);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Get User By ID
roomController.findOne = async (req, res) => {
  try {
    let room = await roomModel.findById(req.params.roomID);
    if (!room) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "room not found" });
    }
    return res.json(room);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Assign room to booking 
roomController.assign = async (req, res) => {
  try {
    let room = await roomModel.findById(req.params.roomID);
    if (!room) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "room not found" });
    }else if(room.isBooked)
    {
      return res.status(httpStatus.BAD_REQUEST)
      .json({ message: "room already booked!" });
    }
    
    room.bookings.push(req.params.bookingID)
    room.isBooked = "true";
    await room.save();
    return res.json(room);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

// Delete User By ID
roomController.delete = async (req, res) => {
  try {
    let room = await roomModel.findByIdAndRemove(req.params.roomID);
    if (!room) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "room not found" });
    }
    return res.json({ message: "room deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

export default roomController;
