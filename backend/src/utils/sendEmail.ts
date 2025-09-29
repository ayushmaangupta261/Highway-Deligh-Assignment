import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject:string, mail: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

 

  await transporter.sendMail({
    from: `"HD App" <${process.env.EMAIL_USER}>`,
    to,
    subject: subject,
    html: mail,
  });
};
