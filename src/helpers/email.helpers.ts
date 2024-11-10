import { Resend } from 'resend';
import { APP_CONFIG } from '../lib/app.config.js';
import { PublicError } from './error.helpers.js';

const resend = new Resend(APP_CONFIG.resendAPIKey);

interface EmailProps {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailProps) => {
    const response = await resend.emails.send({
        from: `MyFinance <${APP_CONFIG.emailDomain}>`,
        to,
        subject,
        html
    });

    if (response.error) {
        throw new PublicError(500, 'Unable to send email -> ', response);
    }
};
