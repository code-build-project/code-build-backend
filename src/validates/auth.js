import bcrypt from "bcryptjs";

export const login = (req, user) => {
  // Проверка существования пользователя
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
  if (!req.body.password) {
    return {
      data: {
        name: "IncorrectPassword",
        message: "Поле пароля не должно быть пустым.",
      },
      status: 400,
    };
  }

  // Проверка на совпадение пароля от клинета и пароля в БД
  const password = bcrypt.compareSync(req.body.password, user.password);

  if (!password) {
    return {
      data: {
        name: "IncorrectPassword",
        message: "Неправильный пароль!",
      },
      status: 401,
    };
  }
};

const recovery = (user) => {
  // Проверка существования пользователя
  if (!user) {
    return {
      data: {
        name: "IncorrectEmail",
        message: "Пользователь с таким e-mail не зарегистрирован.",
      },
      status: 401,
    };
  }
};

export default { login, recovery };
