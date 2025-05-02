import mongoose from "mongoose";
import { Comment } from "../models/comments.model.js";

export const getVideoComments = async (req, res) => {
    //TODO: get all comments for a video
    try {
        const {videoId} = req.params
        const {page = 1, limit = 10} = req.query
    
        if (!videoId) {
            return res.status(400).json({ message: "Video ID is required" , success: false });
        }
    
    
        const pageNo = parseInt(page);
        const limitNo = parseInt(limit) 
    
        const comments = await Comment.aggregatePaginate(
            Comment.aggregate([
                {
                    $match:{
                        video: new mongoose.Types.ObjectId(videoId)
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'owner',
                        foreignField: '_id',
                        as:'owner',
                        pipeline: [
                            {
                                $project:{
                                    fullName: 1,
                                    username: 1,
                                    avatar: 1,
                                    coverImage: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: "$owner"
                }
            ]),
            {
                page: pageNo,
                limit: limitNo
            }
        );
    
        return res.status(200).json({
            totalComments: comments.length,
            comments,
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error"  , success: false});
    }
}

export const addComment = async (req, res) => {
    // TODO: add a comment to a video
    try {
        const {videoId} = req.params;
        const {content} = req.body;
        const userId = req.user?._id;
    
        if(!videoId){
            return res.status(400).json({ message: "Video ID is required" , success: false });
        }
    
        if(!userId){
            return res.status(400).json({message: "unauthorize user" , success: false});
        }

        if(!content || content.trim()===""){
            return res.status(400).json({ message: "Comment content is required" , success: false});
        }
    
        const comment = await new Comment({
            content: content.trim(),
            video: videoId,
            owner: userId
        });
        await comment.save();
        return res.status(200).json({message:"comment added successfully" , success: true});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" , success: false});
    }
}

export const updateComment = async (req, res) => {
    // TODO: update a comment
    try {
        const {commentId} = req.params;
        const {content} = req.body;
        const userId = req.user?._id;
    
        if(!userId){
            return res.status(400).json({message: "unauthorized user"});
        }
    
        if(!content || content.trim()===""){
            return res.status(400).json({ message: "Comment content is required" });
        }
    
        const comment = await Comment.findById(commentId);

        if(userId.toString()!==comment.owner.toString()){
            return res.status(401).json("You can only update your own comment")
        }

        comment.content = content.trim();
        await comment.save({validateBeforeSave: false});

        return res.status(200).json("comment updated successfully");

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteComment = async (req, res) => {
    // TODO: delete a comment
    try {
        const {commentId} = req.params;
        const userId = req.user?._id;
    
        if(!userId){
            return res.status(401).json({message: "unauthorized user"});
        }
    
        const comment = await Comment.findById(commentId);

        if(!comment){
            return res.status(404).json({message: "comment not found"});
        }
    
        if(comment.owner.toString() !== userId.toString()){
            return res.status(403).json({message: "you can delete only your comment "})
        }
    
        await comment.deleteOne();
    
        return res.status(200).json({message: "comment deleted succcessfully"});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
