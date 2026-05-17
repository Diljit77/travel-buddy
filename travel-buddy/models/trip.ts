import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  createdAt: { type: Date, default: Date.now }
});

const CompletedActivitySchema = new mongoose.Schema({
  day: Number,
  activityIndex: Number,
  completedAt: { type: Date, default: Date.now }
});

const TripSchema = new mongoose.Schema(
  {
    userId: String,

    destination: String,
    destinationImage: String,
    startLocation: String,
    travelType: String,

    budget: Number,
    days: Number,
    mode: String,

    plan: Object, 

    status: {
      type: String,
      enum: ["planned", "ongoing", "paused", "completed"],
      default: "planned",
    },

    expenses: [ExpenseSchema],
    completedActivities: [CompletedActivitySchema],
    journeyState: {
      startedAt: Date,
      currentDay: { type: Number, default: 1 },
      lastKnownLocation: {
        lat: Number,
        lng: Number
      }
    }
  },
  { timestamps: true }
);

const Trip=mongoose.models.Trip || mongoose.model("Trip", TripSchema);
export default Trip;