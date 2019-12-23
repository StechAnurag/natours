const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a Transporter
  /*
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
    // Activate in Gmail "less secure app" option,
    // Limitation With Gmail : can only send 500 mails / day with personal account, SPAM marked
  });
  */
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Mr. Arg <anurag.dev443@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3) Actually send Email
  return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
