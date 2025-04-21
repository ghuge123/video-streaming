import mongoose from "mongoose";
import { Like } from "../models/likes.model";

export const toggleVideoLike = async (req, res) => {
    try {
        const {videoId} = req.params
        //TODO: toggle like on video
        const userId = req.user?._id;
    
        if(!videoId){
            return res.status(400).json({message: "video id is not found"});
        }
    
        if(!userId){
            return res.status(401).json({message: "unauthorized user"});
        }
    
        const isLiked = await Like.findOne({
            video : videoId,
            likedBy : userId
        });
    
        if(isLiked){
            await Like.findByIdAndDelete(isLiked._id);
            return res.status(200).json({message: "user disliked the video" , liked: false});
        }
        const like =  new Like({
            video: videoId,
            likedBy: userId
        });
    
        await like.save();
        return res.status(200).json({message: "user liked the video" , liked: true});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const toggleCommentLike = async (req, res) => {
    try {
        const {commentId} = req.params
        //TODO: toggle like on comment
        const userId = req.user?._id;
    
        if(!commentId){
            return res.status(400).json({message: "comment id is not found"});
        }
    
        if(!userId){
            return res.status(401).json({message: "unauthorized user"});
        }
    
        const existingLike = await Like.findOne({
            comment: commentId,
            likedBy: userId
        });
    
        if(existingLike){
            await Like.findByIdAndDelete(existingLike._id);
            return req.status(200).json({message: "comment dislike successfully" , liked: false})
        }
    
        const like = new Like({
            comment: commentId,
            likedBy: userId
        });
    
        await like.save();
        return res.status(200).json({message: "comment liked" , liked: true});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const toggleTweetLike = async (req, res) => {
    try {
        const {tweetId} = req.params;
        //TODO: toggle like on tweet
        const userId = req.user?._id;
    
        if(!tweetId){
            return res.status(400).json({message: "tweet id is not found"});
        }
    
        if(!userId){
            return res.status(401).json({message: "unauthorized user"});
        }
    
        const existingLike = await Like.findOne({
            tweet: tweetId,
            likedBy: userId
        });
    
        if(existingLike){
            await Like.findByIdAndDelete(existingLike._id);
            return res.status(200).json({message: "user dislike tweet" , liked: false})
        }
    
        const like = new Like({
            tweet: tweetId,
            likedBy: userId
        });
    
        await like.save();
        return res.status(200).json({message: "user liked tweet" , liked: true});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getLikedVideos = async (req, res) => {
    //TODO: get all liked videos
    try {
        const userId = req.user?._id;
    
        if(!userId){
            return res.status(401).json({message: "unauthorized user"});
        }
    
        const likedVideos = await Like.aggregate([
            {
                $match: {
                    likedBy: new mongoose.Types.ObjectId(userId),
                    video: { $ne: null } // ensures only video likes
                }
            },
            {
                $lookup: {
                    from: 'videos',
                    localField: 'video',
                    foreignField: '_id',
                    as: 'videoData'
                }
            },
            {
                $unwind: "$videoData"
            },
            {
                $lookup:{
                    from: 'users',
                    localField: 'videoData.owner',
                    foreignField: '_id',
                    as: 'videoData.owner'
                }
            },
            {
                $unwind: "$videoData.owner"
            },
            {
                $project: {
                    videoFile: '$videoData.videoFile',
                    thumbnail: '$videoData.thumbnail',
                    title: '$videoData.title',
                    duration: "$videoData.duration",
                    views: "$videoData.views",
                    owner: {
                        username: "$videoData.owner.username",
                        fullName: "$videoData.owner.fullName",
                        avatar: "$videoData.owner.avatar"
                    }
                }
            }
        ])
    
        return res.status(200).json({message: "user liked videos" , likedVideos});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}