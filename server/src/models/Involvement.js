import mongoose from "mongoose";

const involvementSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const Involvement = mongoose.model("Involvement", involvementSchema);
