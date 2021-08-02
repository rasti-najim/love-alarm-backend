const nodemailer = require("nodemailer");
const genEmailToken = require("../utils/genEmailToken");

async function sendEmail(user_email) {
  try {
    const emailToken = genEmailToken(user_email);

    const url = `http://localhost:5000/api/confirmation/${emailToken}`;

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const email = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `Please click this link to confirm your email: <a href=${url}>${url}</a>`, // html body
    });

    console.log(`Email sent: ${email.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(email)}`);

    return emailToken;
  } catch (error) {
    console.log(error.message);
    // res.sendStatus(500);
  }
}

module.exports = sendEmail;
