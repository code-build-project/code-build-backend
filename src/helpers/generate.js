/**
 * Генерация случайного пароля
 * @param {int} min - минимальное количество символов
 * @param {int} max - максимальное количество символов
 */
export const generatePassword = (min = 8, max = 12) => {
  const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = Math.floor(Math.random() * (max - min + 1)) + min;
  let password = "";

  for (let i = 0; i < length; i++) {
    password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  }

  return password;
};