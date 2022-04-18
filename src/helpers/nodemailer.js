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

const createMail = (info) => {
  return {
    from: '"Codebuild" <code-build@yandex.ru>',
    to: info.to,
    subject: info.subject,
    html: `
      <div style="width: 100%; font-family: 'Arial'; text-align: center; background: rgb(238, 239, 239); padding: 20px 0px;">
        <div style="width: 80%; display: inline-block; background: white; border-radius: 4px;">
          <div style="width: 100%; color: #2468f2; font-size: 23px; border-bottom: 2px solid rgb(238, 239, 239); padding: 20px 0px;">
            codebuild
          </div>
          <div style="width: 100%; text-align: left; color: black; border-bottom: 2px solid rgb(238, 239, 239); padding: 20px; line-height: 2;">
            <div>Здравствуйте.</div>
            <div>${info.message}</div>
          </div>
          <div style="width: 100%; color: black; padding: 25px 0px; line-height: 2; display: flex; align-items: center; flex-direction: column;">
            <div style="font-size: 20px;">Ваш пароль:</div>
            <div style="font-weight: bold;">${info.password}</div>
          </div>
        </div>
      </div>
    `,
  };
};

export const sendMail = async (info) => {
  try {
    const mail = createMail(info);
    return await transporter.sendMail(mail);
  } catch (err) {
    const error = {
      name: "EENVELOPE",
      message: "Данный e-mail недействителен.",
    };

    if (err.code === "EENVELOPE") {
      throw error;
    } else throw err;
  }
};