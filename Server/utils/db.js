const mongoose = require("mongoose")

const URI = process.env.CONNECTION_STRING

const connectDb = async () => {
    try {
        await mongoose.connect(URI)
        console.log("Connection VAYOO")
        
    } catch (error) {
        console.log("connection FAILED")
        process.exit(0);
    }
}


module.exports = connectDb;