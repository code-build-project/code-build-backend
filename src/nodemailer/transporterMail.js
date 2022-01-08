import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "code-build@yandex.ru",
    pass: "nvnctaqkksgaoqqq",
  },
});

// const createMail = (login, password) => {
//   return {
//     from: '"Codebuild" <code-build@yandex.ru>',
//     to: "ya.sham@yandex.ru",
//     subject: "Подтверждение регистрации",
//     html: `
//       <h2>Поздравляем! Вы успешно зарегестрировались на нашем сайте.</h2>

//       <i>Данные вашей учетной записи:</i>
//       <ul>
//         <li>login: ${login}</li>
//         <li>password: ${password}</li>
//       </ul>
//     `,
//   };
// };

const createMail = (code) => {
  return {
    from: '"Codebuild" <code-build@yandex.ru>',
    to: "ya.sham@yandex.ru",
    subject: "Код подтверждения",
    html: `
      <h3>Ваш код для подтверждения регистрации на CodeBuild:</h3>
      <i>${code}</i>
    `,
  };
};

const sendMail = async (code) => {
  const mail = createMail(code);
  return transporter.sendMail(mail);
};

export { transporter, createMail, sendMail };
