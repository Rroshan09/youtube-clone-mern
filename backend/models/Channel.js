import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      trim: true
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    channelBanner: {
      type: String,
      default: "https://placehold.co/1200x300?text=Channel+Banner"
    },
    subscribers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],
//commit
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
      }
    ]
  },
  { timestamps: true }
);

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;