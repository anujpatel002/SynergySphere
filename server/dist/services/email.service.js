"use strict";
// server/src/services/email.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendProjectInviteEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;
const transporter = nodemailer_1.default.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '2525', 10),
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});
const sendEmail = async (options) => {
    const message = {
        from: EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };
    try {
        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
};
// --- Email Templates ---
const sendProjectInviteEmail = async (toEmail, inviter, projectName) => {
    const subject = `You've been invited to join a project on SynergySphere`;
    const text = `Hello, ${inviter.name} has invited you to collaborate on the project "${projectName}". Join now on SynergySphere!`;
    const html = `<p>Hello,</p><p>${inviter.name} has invited you to collaborate on the project "<b>${projectName}</b>".</p><p>Join now on SynergySphere!</p>`;
    await sendEmail({ to: toEmail, subject, text, html });
};
exports.sendProjectInviteEmail = sendProjectInviteEmail;
