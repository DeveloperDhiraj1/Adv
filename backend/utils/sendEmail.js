import nodemailer from 'nodemailer';
import dns from 'node:dns/promises';
import net from 'node:net';

export const sendEmail = async (options) => {
  const port = Number(process.env.EMAIL_PORT || 587);

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email configuration is missing. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER and EMAIL_PASS.');
  }

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('EMAIL_PORT must be a valid number.');
  }

  const smtpHost = process.env.EMAIL_HOST;
  let smtpAddress = smtpHost;

  // Nodemailer may randomly choose the IPv6 result when a hostname has both
  // A and AAAA records. Resolve only the A record and connect to that IP.
  // Keep the original hostname as TLS SNI so Gmail still presents the right
  // certificate.
  if (!net.isIPv4(smtpHost)) {
    const ipv4Addresses = await dns.resolve4(smtpHost);
    if (!ipv4Addresses.length) {
      throw new Error(`No IPv4 address found for ${smtpHost}.`);
    }
    smtpAddress = ipv4Addresses[0];
  }

  const transporter = nodemailer.createTransport({
    host: smtpAddress,
    port,
    // Keep this as a second line of defense for direct socket connections.
    family: 4,
    // Port 465 expects implicit TLS; 587 normally starts with STARTTLS.
    secure: port === 465,
    requireTLS: port === 587,
    tls: {
      servername: smtpHost,
    },
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
