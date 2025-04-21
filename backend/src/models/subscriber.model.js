import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const subscriberSchema = new mongoose.Schema({
    subscriber : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    channel : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
} , {timestamps : true});

subscriberSchema.plugin(mongooseAggregatePaginate);

export const Subscriber = mongoose.model('Subscriber' , subscriberSchema);