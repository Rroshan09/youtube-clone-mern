import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

export const createVideo = async (req, res) => {
  try {
    const {
      title,
      thumbnailUrl,
      videoUrl,
      description,
      category,
      channel
    } = req.body;

    if (!title || !thumbnailUrl || !videoUrl || !category || !channel) {
      return res.status(400).json({
        success: false,
        message: "Title, thumbnailUrl, videoUrl, category and channel are required"
      });
    }

    const existingChannel = await Channel.findById(channel);

    if (!existingChannel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found"
      });
    }

    if (existingChannel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can upload videos only to your own channel"
      });
    }

    const video = await Video.create({
      title,
      thumbnailUrl,
      videoUrl,
      description,
      category,
      channel,
      uploader: req.user._id
    });

    existingChannel.videos.push(video._id);
    await existingChannel.save();

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Video upload failed",
      error: error.message
    });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const { search, category } = req.query;

    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const videos = await Video.find(filter)
      .populate("channel", "channelName handle")
      .populate("uploader", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
      error: error.message
    });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("channel", "channelName handle subscribers")
      .populate("uploader", "username avatar");

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    video.views += 1;
    await video.save();

    res.status(200).json({
      success: true,
      video
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch video",
      error: error.message
    });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own video"
      });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video: updatedVideo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Video update failed",
      error: error.message
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own video"
      });
    }

    await Channel.findByIdAndUpdate(video.channel, {
      $pull: { videos: video._id }
    });

    await Video.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Video deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Video delete failed",
      error: error.message
    });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = video.likes.some(
      (id) => id.toString() === userId
    );

    const alreadyDisliked = video.dislikes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      video.likes = video.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      video.likes.push(req.user._id);

      if (alreadyDisliked) {
        video.dislikes = video.dislikes.filter(
          (id) => id.toString() !== userId
        );
      }
    }

    await video.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Like removed" : "Video liked",
      likes: video.likes.length,
      dislikes: video.dislikes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to like video",
      error: error.message
    });
  }
};

export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    const userId = req.user._id.toString();

    const alreadyDisliked = video.dislikes.some(
      (id) => id.toString() === userId
    );

    const alreadyLiked = video.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyDisliked) {
      video.dislikes = video.dislikes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      video.dislikes.push(req.user._id);

      if (alreadyLiked) {
        video.likes = video.likes.filter(
          (id) => id.toString() !== userId
        );
      }
    }

    await video.save();

    res.status(200).json({
      success: true,
      message: alreadyDisliked ? "Dislike removed" : "Video disliked",
      likes: video.likes.length,
      dislikes: video.dislikes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to dislike video",
      error: error.message
    });
  }
};