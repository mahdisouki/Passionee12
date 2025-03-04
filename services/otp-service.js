const nodemailer = require('nodemailer');
const twilio = require('twilio');
const otpGenerator = require('otp-generator');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOTP = () => otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

const sendEmailOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`
    };
    await transporter.sendMail(mailOptions);
};

const sendSMSOTP = async (phone, otp) => {
    await twilioClient.messages.create({
        body: `Your OTP code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
    });
};

module.exports = { generateOTP, sendEmailOTP, sendSMSOTP };