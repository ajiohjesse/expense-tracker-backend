import { Resend } from 'resend';
import { APP_CONFIG } from '../lib/app.config.js';

const resend = new Resend(APP_CONFIG.resendAPIKey);

interface EmailProps {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailProps) => {
    await resend.emails.send({
        from: `MyFinance <${APP_CONFIG.emailDomain}>`,
        to,
        subject,
        html
    });
};
