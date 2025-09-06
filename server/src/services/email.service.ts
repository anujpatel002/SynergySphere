// server/src/services/email.service.ts

import nodemailer from 'nodemailer';
import { IUser } from '../models/User.model';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '2525', 10),
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

const sendEmail = async (options: EmailOptions) => {
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
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// --- Email Templates ---

export const sendProjectInviteEmail = async (toEmail: string, inviter: IUser, projectName: string) => {
    const subject = `You've been invited to join a project on SynergySphere`;
    const text = `Hello, ${inviter.name} has invited you to collaborate on the project "${projectName}". Join now on SynergySphere!`;
    const html = `<p>Hello,</p><p>${inviter.name} has invited you to collaborate on the project "<b>${projectName}</b>".</p><p>Join now on SynergySphere!</p>`;

    await sendEmail({ to: toEmail, subject, text, html });
};