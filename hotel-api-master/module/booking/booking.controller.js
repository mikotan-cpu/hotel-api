import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { bookingModel } from "./booking.model";
import httpStatus from "../../utils/httpStatus";
import appConfig from "../../config/env";

const bookingController = {};

// Add Booking
bookingController.add = async (req, res, next) => {
  //
  const { bookingID, startDate, endDate, roomID } = req.body;

  try {
    const booking = await bookingModel.create({

      startDate,
      endDate,
      // roomID,
      userId: req.user.userId,
    });

    await booking.save();

    res.json(booking);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Get All Bookings 
bookingController.findAll = async (req, res) => {
  try {
    const user = req.user.userId
    let booking = await bookingModel.find({userId : user});
    return res.json(booking);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Get User By ID
bookingController.findOne = async (req, res) => {
  try {
    let booking = await bookingModel.findById(req.params.bookingID);
    if (!booking) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "booking not found" });
    }
    return res.json(booking);
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: error.toString() });
  }
};

// Update User By ID
bookingController.update = async (req, res) => {
  try {
    let booking = await bookingModel.findById(req.params.bookingID);
    if (!booking) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "booking not found" });
    }
    Object.assign(booking, req.body);
    
    await booking.save();
    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

// Delete User By ID
bookingController.delete = async (req, res) => {
  try {
    let booking = await bookingModel.findByIdAndRemove(req.params.bookingID);
    if (!booking) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "booking not found" });
    }
    return res.json({ message: "booking deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.toString() });
  }
};

export default bookingController;
