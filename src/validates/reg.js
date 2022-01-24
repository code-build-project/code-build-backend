import bcrypt from "bcryptjs";

const create = (user, candidate) => {
  // Проверка существования пользователя
  if (user) {
    return {
      data: {
        name: "IncorrectEmail",
        message: "Пользователь с таким e-mail уже зарегистрирован.",
      },
      status: 401,
    };
  }

  // Проверка отправки пароля на данный email ранее
  if (candidate) {
    return {
      data: {
        name: "IncorrectEmail",
        message: "Срок действия предыдущего пароля еще не истек.",
      },
      status: 409,
    };
  }
};

const confirm = (candidate, req, user) => {
  // Проверка существования кандидата в БД
  if (!candidate) {
    return {
      data: {
        name: "IncorrectPassword",
        message: "Время подтверждения регистрации истекло.",
      },
      status: 401,
    };
  }

  // Проверка на пустое значение пароля
  if (!req.body.password) {
    return {
      data: {
        name: "IncorrectPassword",
        message: "Значение пароля не должно быть пустым.",
      },
      status: 400,
    };
  }

  // Проверка на совпадение пароля от клинета и пароля в БД кандадатов
  const password = bcrypt.compareSync(req.body.password, candidate.password);

  if (!password) {
    return {
      data: {
        name: "IncorrectPassword",
        message: "Неправильный пароль.",
      },
      status: 401,
    };
  }

  // Проверка на существования пользователя в БД
  if (user) {
    return {
      data: {
        name: "IncorrectEmail",
        message: "Такой e-mail уже зарегестрирован.",
      },
      status: 409,
    };
  }
};

export default { create, confirm };
