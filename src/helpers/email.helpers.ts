import { Resend } from 'resend';
import { APP_CONFIG } from '../lib/app.config.js';
import { logger } from './logger.helpers.js';

const resend = new Resend(APP_CONFIG.resendAPIKey);

interface EmailProps {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailProps) => {
    logger.info(`Sending email to ${to} with subject ${subject}`);

    const res = await resend.emails.send({
        from: `MyFinance <${APP_CONFIG.emailDomain}>`,
        to,
        subject,
        html
    });

    logger.info('Email response', res);
};
