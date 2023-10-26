const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmails = async (email, subject, payload, template) => {
  try {
    const MG_AUTH = {
      auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
      },
    };
    const transporter = nodemailer.createTransport(mg(MG_AUTH));
    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: subject,
      html: compiledTemplate(payload),
    };

    const info = await transporter.sendMail(options);
    console.log(info);
    return info;
  } catch (error) {
    console.log(error);
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = {sendEmails};
