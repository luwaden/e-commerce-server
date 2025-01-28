import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";
import { IMailOptions } from "../interface/user.interface";

const sendMail = async (options: IMailOptions) => {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    throw new Error("MAILGUN_API_KEY or MAILGUN_DOMAIN is not set");
  }
  const auth = {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  };
  const transport = nodemailer.createTransport(mg({ auth }));
  const message = {
    from: `prox@${process.env.MAILGUN_DOMAIN}`,
    to: options.email,
    text: options.message,
    subject: options.subject,
  };
  console.log(message);
  const info = await transport.sendMail(message);
  console.log(`message sent: ${info.messageId}`);
};
export default sendMail;
