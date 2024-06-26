import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connect to Mongo DB',err.message);
    }
}

export default connectToMongoDB;