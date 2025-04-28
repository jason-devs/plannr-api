import nodemailer from "nodemailer";

const sendEmail = async options => {
  const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT } = process.env;

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "<your_name> <example@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
