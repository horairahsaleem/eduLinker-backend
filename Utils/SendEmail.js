import {createTransport} from "nodemailer"

export const sendEmail= async(to,subject,text)=>{

    const transporter = createTransport(

        {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          }
    );

    await transporter.sendMail({
        to,
        subject,
        text,
        from:"horairahsaleem786@gmail.com"
    
    })
}