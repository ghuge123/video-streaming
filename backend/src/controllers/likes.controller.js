import mongoose from "mongoose";
import { Like } from "../models/likes.model.js";

export const toggleVideoLike = async (req, res) => {
    try {
        const {videoId} = req.params
        //TODO: toggle like on video
        const userId = req.user?._id;
    
        if(!videoId){
            return res.status(400).json({message: "video id is not found" , success: false});
        }
    
        if(!userId){
            return res.status(401).json({message: "unauthorized user" , success: false});
        }
    
        const isLiked = await Like.findOne({
            video : videoId,
            likedBy : userId
        });
    
        if(isLiked){
            await Like.findByIdAndDelete(isLiked._id);
            return res.status(200).json({message: "user disliked the video" , liked: false , success:true});
        }
        const like =  new Like({
            video: videoId,
            likedBy: userId
        });
    
        await like.save();
        return res.status(200).json({message: "user liked the video" , liked: true ,  success:true});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" , success: false});
    }
}

export const toggleCommentLike = async (req, res) => {
    try {
        const {commentId} = req.params
        //TODO: toggle like on comment
        const userId = req.user?._id;
    
        if(!commentId){
            return res.status(400).json({message: "comment id is not found" , success:false});
        }
    
        if(!userId){
            return res.status(401).json({message: "unauthorized user", success:false});
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
            return res.status(401).json({message: "unauthorized user" , success: false});
        }
    
        const likedVideos = await Like.find({
            likedBy: userId,  // Check for user who liked
            video: { $ne: null } 
        })
    
        return res.status(200).json({message: "user liked videos" , likedVideos:likedVideos , success: true});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" , success: false});
    }
}

export const getVideoLikes = async (req, res) => {
    try {
        const { videoId } = req.params;

        // Replace with your actual logic to count likes
        const totalLikes = await Like.countDocuments({ video: videoId });

        return res.status(200).json({ success: true, totalLikes });
    } catch (error) {
        console.error("Error in getVideoLikes:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getLikedComments = async (req , res) => {
    const userId = req.user?._id;
    try {
        const likedComments = await Like.find({
            likedBy:userId,
            comment: {$ne : null}
        });
        return res.status(200).json({message: 'user liked comments' , likedComments , success: true})
    } catch (error) {
        return res.status(500).json({message: 'Internal server error' , success: false});
    }
}

export const getCommentLikes = async (req , res)=>{
    const {commentId} = req.params;

    if(!commentId){
        return res.status(400).json({message: 'commentId is required' , success: false});
    }

    try {
        const totalComments = await Like.countDocuments({comment: commentId});
    
        return res.status(200).json({message: 'comment like fetch successfully' , totalComments , success: true});
    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
}
