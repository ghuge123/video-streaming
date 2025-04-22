import mongoose from "mongoose";
import { Subscriber } from "../models/subscriber.model.js";

export const toggleSubscription = async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const userId = req.user?._id;
    if(channelId.toString()===userId.toString()){
        return res.status(401).json("you can not subscribe your own channel");
    }
    const existingSub = await Subscriber.findOne({
        subscriber: userId,
        channel : channelId
    });

    if(existingSub){
        // channel is subscribed --> unsubscribe it
        await Subscriber.findByIdAndDelete(existingSub._id);
        return res.status(200).json("Unsubscribed successfully");
    }else{
        const newSub = await new Subscriber({
            subscriber : userId,
            channel : channelId
        });
        await newSub.save();
        return res.status(200).json("channel Subscribed successfully");
    }
};

export const getUserChannelSubscribers = async (req, res) => {
    const {channelId} = req.params;

    if(!channelId){
        return res.status(401).json("invalid ID")
    }
    const subscribers = await Subscriber.aggregate([
        {
            $match: {
                channel : channelId
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
        subscribers
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
