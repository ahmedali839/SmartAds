import mongoose from "mongoose";

function connectToDb() {
    mongoose.connect(process.env.mongoDBConnection).then(() => {
        console.log("Mongo Database connected Successfully")
    }).catch((error) => {
        console.log("Mongo Database connection error:", error)
    })
}

export default connectToDb