import mongoose, { Types } from "mongoose";
import { Subscriber } from "../models/subscriber.model.js";

export const toggleSubscription = async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const userId = req.user?._id;
    if(channelId.toString()===userId.toString()){
        return res.status(400).json({message: "you can not subscribe your own channel" , success: false});
    }
    const existingSub = await Subscriber.findOne({
        subscriber: userId,
        channel : channelId
    });

    if(existingSub){
        // channel is subscribed --> unsubscribe it
        await Subscriber.findByIdAndDelete(existingSub._id);
        return res.status(200).json({message: "Unsubscribed successfully" , success: true});
    }else{
        const newSub = await new Subscriber({
            subscriber : userId,
            channel : channelId
        });
        await newSub.save();
        return res.status(200).json({message: "channel Subscribed successfully" , success: true});
    }
};

export const getUserChannelSubscribers = async (req, res) => {
    const {channelId} = req.params;

    if(!channelId){
        return res.status(401).json({message: "invalid ID" , success: false})
    }
    const subscribers = await Subscriber.aggregate([
        {
            $match: {
                channel : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: 'subscriber',
                foreignField: '_id',
                as: 'subscriberDetails',
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username : 1,
                            avatar : 1
                        }
                    }
                ]
            }
        },
        {
            $unwind : '$subscriberDetails'
        }
    ]);

    return res.status(200).json({
        totalSubscribers : subscribers.length,
        subscribers : subscribers,
        success : true
    });
};

export const getSubscribedChannels = async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId){
        return res.status(401).json("invalid ID")
    }

    const subscribedTo = await Subscriber.aggregate([
        {
            $match: {
                subscriber : subscriberId
            }
        },
        {
            $lookup: {
                from:"users",
                localField: 'channel',
                foreignField: '_id',
                as: "channelDetails",
                pipeline: [
                    {
                        $project: {
                            fullName : 1,
                            username: 1,
                            avatar : 1
                        }
                    }
                ]
            }
        },
        {
            $unwind : "$channelDetails"
        }
    ])

    return res.status(200).json({
        subscribedCount: subscribedTo.length,
        subscribedTo
    });
}
