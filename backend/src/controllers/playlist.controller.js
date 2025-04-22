import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";

export const createPlaylist = async (req, res) => {
    try {
        const { name, description } = req.body

        //TODO: create playlist

        const userId = req.user?._id;

        const video = await Video.find({
            owner: userId
        });

        if (!video || video.length === 0) {
            return res.status(400).json({ message: "user can't have a any video" });
        }

        const videoIds = video.map((video) => video._id);

        const playlist = new Playlist({
            name: name,
            description: description,
            owner: userId,
            video: videoIds
        })

        await playlist.save();
        return res.status(200).json({ message: "playlist created successfully" }, playlist);

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getUserPlaylists = async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    if (!userId) {
        return res.status(400).json({ message: "userId not found" });
    }
    try {
        const playlists = await Playlist.find({ owner: userId });

        if (!playlists || playlists.length === 0) {
            return res.status(404).json({ message: "No playlists found for this user." });
        }

        return res.status(200).json({
            message: "User's playlists fetched successfully",
            playlists: playlists,
        });
    } catch (error) {
        console.error("Error fetching playlists:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getPlaylistById = async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    if (!playlistId) {
        return res.status(400).json({ message: "playlist id is not found" });
    }
    try {
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ message: "playlist not found" });
        }
        return res.status(200).json(playlist);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const addVideoToPlaylist = async (req, res) => {
    const { playlistId, videoId } = req.params;

    const userId = req.user?._id;

    if (!playlistId) {
        return res.status(400).json({ message: "playListId is required" })
    }
    if (!videoId) {
        return res.status(400).json({ message: "videoid is required to add video" })
    }
    try {
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ message: "playlist not found" });
        }

        if (playlist.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "you are not the owner of this playlist" });
        }

        if (playlist.video.includes(videoId)) {
            return res.status(409).json({ message: "Video already exists in playlist" });
        }

        playlist.video.push(videoId);

        await playlist.save({ validateBeforeSave: false });
        return res.status(200).json({ message: "video added in playlist successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const removeVideoFromPlaylist = async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    const userId = req.user?._id;
    if (!playlistId) {
        return res.status(400).json({ message: "playlistID is required to add video" });
    }
    if (!videoId) {
        return res.status(400).json({ message: "video id is required to delete video" });
    }
    try {
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ message: "can not find playlist" });
        }

        if (playlist.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "you can only delete change your playlist" });
        }

        if (!playlist.video.includes(videoId)) {
            return res.status(404).json({ message: "can not find provided video in your playlist" });
        }
        playlist.video = playlist.video.filter(id => id.toString() !== videoId.toString());

        await playlist.save({ validateBeforeSave: false });
        return res.status(200).json({ message: "video deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const deletePlaylist = async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    const userId = req.user?._id;
    if (!playlistId) {
        return res.status(400).json({ message: "playlist id is required" })
    }
    if (!userId) {
        return res.status(401).json({ message: "unauthorized user" });
    }

    try {
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ message: "playlist not exist" });
        }

        if (playlist.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "you can only delete your own playlist" });
        }

        await playlist.deleteOne();

        return res.status(200).json({ message: "playlist deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const updatePlaylist = async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist

    const userId = req.user?._id;

    if (!playlistId) {
        return res.status(400).json({ message: "playlist id is required" });
    }

    if (!userId) {
        return res.status(401).json({ message: "unauthorized user" });
    }

    if (!name && !description) {
        return res.status(400).json({ message: "name or description is required for update" });
    }
    try {

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ message: "playlist not found" });
        }

        if (playlist.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "you can only update your own playlist" });
        }

        if (name) {
            playlist.name = name;
        }

        if (description) {
            playlist.description = description;
        }

        await playlist.save({validateBeforeSave: false});

        return res.status(200).json({ message: "data updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "internal server error" });
    }
}