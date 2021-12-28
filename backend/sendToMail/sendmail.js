const nodemailer = require('nodemailer')

function sendmail(user,password, receiver_email,filename){
    nodemailer.createTestAccount(async (err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user, // generated ethereal user
                pass: password  // generated ethereal password
            }
        })
            const message = {
              from: `${user} <${user}>`,
              to: `${receiver_email}`,
              subject: "Invoice",
              text: "Order Details PDF has been attached with its mail. ",
              attachments:[{
                  filename:filename ,
                  path:`./data/pdf/${filename}`
              }]
            }
          
        const info = await transporter.sendMail(message);
        console.log(info.messageId);
    });
}

module.exports = sendmail