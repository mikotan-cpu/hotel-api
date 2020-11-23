import mongoose, { Schema } from "mongoose";

const schema = mongoose.Schema;

const roomSchema = new schema({

  isBooked:{
    type : Boolean,
    default : false
  },
  cost:{
    type: Number,
    required : true
  },
  capacity:{
    type: Number,
    required : true
  },
  bookings:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking",
  }],
  
  
});

const roomModel = mongoose.model("room", roomSchema);
export { roomModel };
