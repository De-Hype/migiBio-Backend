import nodemailer from "nodemailer";

const sendMail = async (options) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    service:process.env.SMPT_SERVICE,
    port: process.env.SMPT_PORT,
    secure:false,
    auth: {
      user: process.env.myMail,
      pass: process.env.myMailPassword,
    },
   
  });

  const mailOptions = {
    from:process.env.myMail,
    to:options.email,
    subject:options.subject,
    text:options.message,
  };
  await transporter.sendMail(mailOptions)
};

export default sendMail;
