import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "../Helper/config";
dotenv.config();

const url: string = process.env.DB_URL || config.database.url; 

const dbConnect = (): Promise<typeof mongoose> => {
    return mongoose
        .connect(url)
        .then((con) => {
            console.log("MongoDB is connected");
            return con;
        })
        .catch((err) => {
            console.error("MongoDB connection error:", err);
            throw err;
        });
};

export default dbConnect;