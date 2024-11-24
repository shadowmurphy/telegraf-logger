const fs = require('fs');
const path = require('path');

/**
 * Форматирует текущую дату и время в строку
 * @returns {string} Форматированная дата и время
 */
function getTimestamp() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

/**
 * Записывает сообщение в файл
 * @param {string} logDir Директория для логов
 * @param {string} file Имя файла
 * @param {string} message Сообщение для записи
 */
function writeToFile(logDir, file, message) {
  const filePath = path.join(logDir, file);
  fs.appendFile(filePath, message + '\n', (err) => {
    if (err) {
      console.error(`[Logger Error] Не удалось записать в файл ${file}: ${err.message}`);
    }
  });
}

module.exports = {
  getTimestamp,
  writeToFile
};
