import sgMail from '@sendgrid/mail';
import logger from './logger';

// Check if DB_URI exists
if (!process.env.SENDGRID && process.env.NODE_ENV !== 'test') {
  throw new Error('You must specify SENDGRID in .env');
}

sgMail.setApiKey(process.env.SENDGRID);

export default async ({ to, subject, html }) => {
  return new Promise((resolve, reject) => {
    const msg = {
      to,
      from: process.env.HS_BOOKING_EMAIL,
      subject,
      html
    };
    sgMail
      .send(msg)
      .then(() => {
        resolve();
      })
      .catch(error => {
        // Log friendly error
        logger.error(error.toString());
        reject(error);
      });
  });
};
