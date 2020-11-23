import mongoose, { Schema } from "mongoose";

const schema = mongoose.Schema;

const bookingSchema = new schema({

   roomID: {
     type: mongoose.Schema.Types.ObjectId,
     ref : "room"
   },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required : true
  },
  
});

const bookingModel = mongoose.model("booking", bookingSchema);
export { bookingModel };
