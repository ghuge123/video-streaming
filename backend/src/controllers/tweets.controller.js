import mongoose from "mongoose";
import { Tweet } from "../models/tweets.model";
import { User } from "../models/user.model";

export const createTweet = async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Tweet content is required" });
        }

        const tweet = new Tweet({
            content: content.trim(),
            owner: userId
        });

        await tweet.save();

        return res.status(201).json({
            message: "Tweet created successfully",
            tweet
        });
    } catch (error) {
        console.error("Error creating tweet:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserTweets = async (req, res) => {
    // TODO: get user tweets
    try {
        const userId = req.user?._id;
    
        if(!userId){
            return res.status(401).json({ message: "Unauthorized" });
        }
    
        const tweet = await Tweet.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "userDetails",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$userDetails"
            }
        ]);
    
        return res.status(200).json(tweet);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateTweet = async (req, res) => {
    //TODO: update tweet
    try {
        const {tweetId} = req.params;
        const { content } = req.body;
    
        if(!tweetId){
            return res.status(401).json("can not get id");
        }
    
        if(!content || content.trim()=== ""){
            return res.status(401).json("content is required for update");
        }
    
        const data = await Tweet.findByIdAndUpdate(
           tweetId,
           {
                $set: {
                    content:content.trim()
                }
           },
           {new:true}
        );
    
        if (!data) {
            return res.status(404).json({ message: "Tweet not found" });
        }
    
    
        return res.status(200).json({message:"Tweet updated successfully" , data});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteTweet = async (req, res) => {
    //TODO: delete tweet
    try {
        const {tweetId} = req.params;
        const {userId} = req.user?._id;
    
        if(!tweetId){
            return res.status(401).json("can not get tweet id");
        }
    
        const tweet = await Tweet.findById(tweetId);
    
        if(!tweet){
            return res.status(404).json({ message: "Tweet not found" });
        }
    
        if(tweet.owner.toString() !== userId.toString()){
            return res.status(403).json({ message: "You are not allowed to delete this tweet" });
        }
    
        await tweet.deleteOne();
    
        return res.status(200).json("Tweet deleted successfully");
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

