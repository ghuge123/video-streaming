import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({
    path:'../.env'
});


const connectDB =  async ()=>{
    console.log(process.env.MONGODB_URL);
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}/youtube`);
        console.log("connected to DB");
    } catch (error) {
        console.error(`MONGODB CONNECTION ERROR  ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;