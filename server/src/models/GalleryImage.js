import mongoose from "mongoose";

const galleryImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

export const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
