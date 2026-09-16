import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  const port = Number(process.env.EMAIL_PORT || 587);

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration is missing. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER and EMAIL_PASS.');
  }

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('EMAIL_PORT must be a valid number.');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port,
    // Some Render instances do not have IPv6 egress. Gmail can resolve to an
    // IPv6 address first, so force Nodemailer to use the reachable IPv4 route.
    family: 4,
    // Port 465 expects implicit TLS; 587 normally starts with STARTTLS.
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Expert Consultation Platform" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
