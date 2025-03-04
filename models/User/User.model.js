const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    telephone: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true },
    logo: String,
    googleId: String,
    appleId: String,
    username: { type: String, unique: true, sparse: true },
    password: String,
    typeLogin: {
        type: String,
        enum: ['UserPwd', 'Gmail', 'Apple', 'OTP'],
        default: 'UserPwd'
    },
    dateAdd: { type: Date, default: Date.now },
    abonnement: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);
