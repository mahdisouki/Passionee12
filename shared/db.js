const mongoose = require("mongoose");

mongoose.set('strictQuery', true);

mongoConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 1000 * 60 * 15, // 15 min
}

module.exports = mongoose
    .connect(process.env.MONGODB_URI, mongoConfig)
    .then(() => { console.log(`${new Date().toISOString()} [INFO] Connected to MongoDB`); })
    .catch((error) => { console.error('Error connecting to MongoDB:', error); });