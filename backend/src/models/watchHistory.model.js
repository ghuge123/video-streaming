import mongoose from 'mongoose';

const watchHistorySchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    }
} , {timestamps: true});

export const WatchHistory = mongoose.model('WatchHistory' , watchHistorySchema);