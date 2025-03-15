import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDR,
    pass: process.env.EMAIL_PWD,
  },
});

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export default (to: string, subject: string, text: string): void => {
  const mailOptions: MailOptions = {
    from: process.env.EMAIL_USER as string,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.error('Email sent:', info.response);
    }
  });
};