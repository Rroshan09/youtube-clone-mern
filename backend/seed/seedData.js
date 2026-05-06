import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await Video.deleteMany({});
    await Channel.deleteMany({});
    await User.deleteOne({ email: "roshanritesh099@gmail.com" });

    const user = await User.create({
      username: "Ritesh",
      email: "roshanritesh099@gmail.com",
      password: await bcrypt.hash("123456", 10)
    });

    const channel = await Channel.create({
      channelName: "Ritesh Channel",
      handle: "ritesh-channel",
      owner: user._id,
      description: "YouTube clone demo channel",
      videos: []
    });

    const videos = await Video.insertMany([
      {
        title: "Learn React in 30 Minutes",
        thumbnailUrl: "https://i.ytimg.com/vi/SqcY0GlETPk/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
        description: "React beginner tutorial",
        category: "React",
        channel: channel._id,
        uploader: user._id,
        views: 15200
      },
      {
        title: "Node.js Crash Course",
        thumbnailUrl: "https://i.ytimg.com/vi/fBNz5xF-Kx4/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
        description: "Node.js backend tutorial",
        category: "Node",
        channel: channel._id,
        uploader: user._id,
        views: 9800
      }
    ]);

    channel.videos = videos.map((video) => video._id);
    await channel.save();

    user.channels = [channel._id];
    await user.save();

    console.log("✅ Seed data inserted successfully");
    console.log("Login email: roshanritesh099@gmail.com");
    console.log("Password: 123456");
    process.exit();
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedData();