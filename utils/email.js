const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[1];
    this.url = url;
    this.from = 'Mr. Arg <anurag.dev443@gmail.com>';
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid sends email
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
  }

  // Send the actual mail
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define mailOptions
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create a Transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPassReset() {
    await this.send('passwordReset', 'Your password reset token (valid for 10mins)');
  }
};

/*
const sendEmail = async options => {
  // 1) Create a Transporter
  
  // const transporter = nodemailer.createTransport({
  //  service: 'Gmail',
  //  auth: {
  //    user: process.env.EMAIL_USER,
  //    pass: process.env.EMAIL_PASS
  //  }
    // Activate in Gmail "less secure app" option,
    // Limitation With Gmail : can only send 500 mails / day with personal account, SPAM marked
  //});
  
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
*/
//module.exports = sendEmail;
