import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likesSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
} , {timestamps : true});

likesSchema.plugin(mongooseAggregatePaginate);

export const Like = mongoose.model('Like', likesSchema);