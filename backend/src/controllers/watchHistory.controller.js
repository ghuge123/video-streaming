import { WatchHistory } from "../models/watchHistory.model.js";

export const addWatchHistory = async (req , res) =>{
    const {userId , videoId} = req.body;
    if(!userId){
        return res.status(400).json({message: 'UserId is required' , success: true});
    }
    if(!videoId){
        return res.status(400).json({message: 'VideoId is required' , success: true})
    }

    try {
        const isExist = await WatchHistory.findOne({
            user: userId,
            video: videoId
        });
    
        if(isExist){
            const updateHistory = await WatchHistory.findByIdAndUpdate(isExist._id , {
                createdAt: Date.now()
            }, {new: true});
            return res.status(200).json({message: 'updated Successfully' , success: true});
        }
        const createWatchHistory = new WatchHistory({
            user: userId,
            video: videoId
        });
    
        const data = await createWatchHistory.save();
        return res.status(200).json({message: 'created Successfully' , success: true});
    } catch (error) {
        return res.status(500).json({message: 'Internal server Error'});
    }
}

export const getWatchHistory = async (req , res) =>{
    const userId = req.user?._id;
    const data = await WatchHistory.find({
        user: userId
    }).sort({ createdAt: -1 }).populate('video');

    return res.status(200).json({message: 'watch history', history: data , success: true});
}