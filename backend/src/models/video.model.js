import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        required : true
    },
    thumbnail: {
        type: String,
        required : true
    },
    title: {
        type: String,
        required : true
    },
    description: {
        type: String,
        required : true
    },
    views: {
        type: Number,
        default: 0,
        required : true
    },
    duration: {
        type: Number,
        default: 0,
        required : true
    },
    isPublished: {
        type: Boolean,
        default: true,
        required : true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

} , {timestamps : true})

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video' , videoSchema);