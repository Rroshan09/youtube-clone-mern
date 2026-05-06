import Channel from "../models/Channel.js";
import User from "../models/User.js";

export const createChannel = async (req, res) => {
  try {
    const { channelName, handle, description, channelBanner } = req.body;

    if (!channelName || !handle) {
      return res.status(400).json({
        success: false,
        message: "Channel name and handle are required"
      });
    }

    const existingHandle = await Channel.findOne({ handle });

    if (existingHandle) {
      return res.status(400).json({
        success: false,
        message: "Channel handle already exists"
      });
    }

    const channel = await Channel.create({
      channelName,
      handle,
      description,
      channelBanner,
      owner: req.user._id,
      subscribers: [],
      videos: []
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id }
    });

    res.status(201).json({
      success: true,
      message: "Channel created successfully",
      channel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Channel creation failed",
      error: error.message
    });
  }
};

export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find().populate(
      "owner",
      "username email avatar"
    );

    res.status(200).json({
      success: true,
      count: channels.length,
      channels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch channels",
      error: error.message
    });
  }
};

export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user._id })
      .populate("owner", "username email avatar")
      .populate("videos");

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "No channel found"
      });
    }

    res.status(200).json({
      success: true,
      channel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your channel",
      error: error.message
    });
  }
};


export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate(
      "owner",
      "username email avatar"
    );

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found"
      });
    }

    res.status(200).json({
      success: true,
      channel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch channel",
      error: error.message
    });
  }
};

export const toggleSubscribe = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found"
      });
    }

    if (!channel.subscribers) {
      channel.subscribers = [];
    }

    if (channel.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot subscribe to your own channel"
      });
    }

    const alreadySubscribed = channel.subscribers.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (alreadySubscribed) {
      channel.subscribers = channel.subscribers.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    } else {
      channel.subscribers.push(req.user._id);
    }

    await channel.save();

    res.status(200).json({
      success: true,
      message: alreadySubscribed
        ? "Unsubscribed successfully"
        : "Subscribed successfully",
      subscribers: channel.subscribers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Subscription failed",
      error: error.message
    });
  }
};