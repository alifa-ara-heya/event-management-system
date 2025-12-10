import nodemailer from 'nodemailer';
import config from '../../config';

const emailSender = async (email: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.emailSender.email,
            pass: config.emailSender.app_pass,
        },
    });

    const info = await transporter.sendMail({
        from: `"Event Management" <${config.emailSender.email}>`,
        to: email,
        subject: "Reset Password Link",
        html: html,
    });

    console.log("Message sent: %s", info.messageId);
};

export default emailSender;

