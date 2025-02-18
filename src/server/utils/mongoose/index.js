//@ts-check
import mongoose from "mongoose";

mongoose.connect(`${process.env.MONGO_DB_SERVER}/lifeline`, {
    maxPoolSize: 100,
    minPoolSize: 50,
});

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (error) => {
    console.log(error);
});

export default mongoose;
