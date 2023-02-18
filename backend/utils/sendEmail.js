const nodeMailer = require("nodemailer");


exports.sendEmail = async (otptions) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        post: process.env.SMPT_PORT,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        },
    });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: otptions.email,
        subject: otptions.subject,
        text: otptions.message
    };
    console.log(mailOptions);

    await transporter.sendMail(mailOptions);
}