import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'code-build@yandex.ru',
    pass: 'Sunshine195',
  },
})

let result = await transporter.sendMail({
  from: '"Node js" <code-build@yandex.ru>',
  to: 'user@example.com, user@example.com',
  subject: 'Message from Node js',
  text: 'This message was sent from Node js server.',
  html:
    'This <i>message</i> was sent from <strong>Node js</strong> server.',
})


console.log(result)

export default {
  sendMail() {
    
  }
}