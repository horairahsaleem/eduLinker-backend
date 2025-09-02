import {createTransport} from "nodemailer"

export const sendEmail= async(to,subject,text,replyTo)=>{

    const transporter = createTransport(

        {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
              logger: true,   // logs everything
              debug: true,    // show detailed connection logs
          }
    );

   await transporter.sendMail({
  from: '"CourseBundler" <horairahsaleem7864@gmail.com>',
  to,
  subject,
  text,
  ...(replyTo && { replyTo }),   // only add replyTo if it's provided
});

}