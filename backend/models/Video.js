import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    thumbnailUrl: {
      type: String,
      required: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      required: true
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: "User",
  default: []
},
dislikes: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: "User",
  default: []
},
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;