import transporter from "../config/nodemailer.js";

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html,
  });
};

export default sendEmail;
