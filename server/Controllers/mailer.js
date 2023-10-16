import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import ENV from "../config.js";

//https://ethereal.email/create
// let nodeconfig = {
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false,
//   auth: {
//     // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//     user: ENV.EMAIL,
//     pass: ENV.PASSWORD,
//   },
// };

let nodeconfig = {
      service : 'gmail',
      auth: {
        user: ENV.EMAIL,
        pass: ENV.PASSWORD,
      },
    };

let transporter = nodemailer.createTransport(nodeconfig);

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

/**POST: http://localhost:8080/api/registerMail 
 * @param:{
    "username" :"example123",
    "userEmail" :"admin123",
    "text" : "",
    "subject" :""
  }
*/

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;
  //body of the email
  var email = {
    body: {
      name: username,
      intro: text || "welcome ,we are excited to have you",
      outro: "Need help?,happy to help you",
    },
  };
  var emailBody = MailGenerator.generate(email);

  let message = {
    from: ENV.EMAIL,
    to: userEmail,
    subject: subject || "signup successfull",
    html: emailBody,
  };
  //send mail
  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "you have recieved an email from us" });
    })
    .catch((error) => res.status(500).send({ error }));
};
