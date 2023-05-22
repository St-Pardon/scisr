import mongoose from "mongoose";
import { MONGO_URI } from "./env.config";

export const ConnectToDB = ():void =>{
    mongoose.connect(MONGO_URI)
    mongoose.connection.on("connected", ()=> console.log("Connection to mongodb atlas successful"))
    mongoose.connection.on('error', (err)=>console.log(`Error connecting to mongodb atlas -> ${err}`))
}