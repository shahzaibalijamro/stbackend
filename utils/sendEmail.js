const nodemailer = require("nodemailer");
// Email send karne ka function
module.exports = async function sendEmailWithAttachment(filePath, fileName) {
    try {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL, // Apna email daalein
          pass: process.env.APP_PASS, // Apna email password ya App Password use karein
        },
      });
  
      let mailOptions = {
        from: process.env.EMAIL,
        to: "ayansheikh6600@gmail.com", // Jis email per bhejna hai
        subject: "Monthly Sales Report",
        text: "Attached is the monthly sales report.",
        attachments: [
          {
            filename: fileName,
            path: filePath,
          },
        ],
      };
  
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }