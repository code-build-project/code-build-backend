import bcrypt from "bcryptjs";

const changeUserPassword = (user, req) => {
  // Проверка существования кандидата в БД
  if (!user) {
    return {
      data: {
        name: "IncorrectEmail",
        message: "Пользователь с таким e-mail не зарегистрирован.",
      },
      status: 401,
    };
  }

  // Проверка на пустое значение пароля
  if (!req.body.oldPassword) {
    return {
      data: {
        name: "IncorrectPassword",
        message: "Значение пароля не должно быть пустым.",
      },
      status: 400,
    };
  }

  // Проверка на совпадение пароля от клинета и пароля в БД кандадатов
  const password = bcrypt.compareSync(req.body.oldPassword, user.password);

  if (!password) {
    return {
      data: {
        name: "IncorrectPassword",
        message: "Неправильный пароль.",
      },
      status: 401,
    };
  }

  // Проверка минимального количества символов нового пароля
  if (req.body.newPassword.length < 8) {
    return {
      data: {
        name: "IncorrectPassword",
        message: "Пароль не может быть меньше 8 символов.",
      },
      status: 400,
    };
  }

  // Проверка максимального количества символов нового пароля
  if (req.body.newPassword.length > 12) {
    return {
      data: {
        name: "IncorrectPassword",
        message: "Пароль не может быть больше 12 символов.",
      },
      status: 400,
    };
  }

  // Проверка у нового пароля первого и последнего символа на пробел
  let newPassword = req.body.newPassword;
  let lastIndex = req.body.newPassword.length - 1;
  if (newPassword.charAt(0) === " " || newPassword.charAt(lastIndex) === " ") {
    return {
      data: {
        name: "IncorrectPassword",
        message: "Первый и последний символ пароля не может быть пробелом.",
      },
      status: 400,
    };
  }
};

export default { changeUserPassword };
