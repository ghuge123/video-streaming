import mongoose from "mongoose";
import { Video } from "../models/video.model.js";


export const getAllVideos = async (req, res) => {
    try {
        const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
        //TODO: get all videos based on query, sort, pagination
        const filter = {};
        if(query){
            filter.title = {$regex: query , $options: 'i'};
        }
        if(userId){
            filter.owner = userId;
        }
        const sort = {};
        if(sortBy){
            sort[sortBy] = sortType === 'asc'? 1:-1;
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const limitNum = parseInt(limit);
    
        const videos = await Video.aggregate([
            {
                $match: filter
            },
            {
                $sort: sort
            },
            {
                $skip: skip
            },
            {
                $limit: limitNum
            }
        ]);
    
        const total = await Video.countDocuments(videos);
    
        return res
        .status(200)
        .json(total);
    } catch (error) {
        return res.status(401).json(error);
    }
};

export const publishAVideo = async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const video = req.files?.videoFile?.path;
    const thumbnail = req.files?.thumbnail?.path;

    if(!video){
        return res.status(401).json({message: "video file is required" , success: false});
    }
    if(!thumbnail){
        return res.status(401).json({message: "thumbnail file is required" , success: false});
    }

    console.log(video.duration);
    const data = await new Video({
        title : title,
        description : description,
        videoFile : video,
        thumbnail : thumbnail,
        views : 0,
        isisPublished : true,
        duration: video.duration,
        owner : req.user._id
    });
    return res
    .status(200)
    .json({video: data , success: true});
}

export const getVideoById = async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        return res.status(404).json("Video ID not Found");
    }
    //TODO: get video by id
    const video = await Video.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: 'User',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner',
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                            createdAt: 1
                        }
                    }
                ]
            }
        }
    ])

    if(!video){
        return res.status(404).json("Video Not Found");
    }

    return res.status(200).json(video);
};

export const updateVideo = async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title , description} = req.body;
    const {thumbnail} =  req.file;
    const filter = {};
    if((!title && !description) && !thumbnail){
        return res.status(401).json("require data for update");
    }
    if(title){
        filter.title = title
    }
    if(description){
        filter.description = description;
    }
    const thumbnailLocalPath = thumbnail?.path;
    if(thumbnailLocalPath){
        filter.thumbnail = thumbnailLocalPath
    }

    const data = await Video.findByIdAndUpdate(
        videoId , 
        {$set: filter} ,
        {new : true}
    );
    if(!data){
        return res.status(400).json("videa not found");
    }

    return res.status(200).json("video updated successfully");
};

export const deleteVideo = async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id;
    //TODO: delete video
    try {
        const video = await Video.findById(videoId);
        if(!video){
            return res.status(401).json("video not found");
        }
    
        if(video.owner.toString() !== video.userId.toString()){
            return res.status(403).json({message: "you can't delete others file"});
        }
    
        await Video.findByIdAndDelete(videoId);
        
        return res.status(200).json("video deleted successfully");
    } catch (error) {
        return res.status(500).json({message: "internal server error"});
    }
};

export const togglePublishStatus = async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId);
    if(!video){
        return res.status(401).json("video not found");
    }

    let isPublished = video.isPublished;

    video.isPublished = !isPublished;

    await video.save({ validateBeforeSave: false });

    return res.status(200).json("isPublished toggle successfully");
}


