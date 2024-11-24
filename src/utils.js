// src/utils.js

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
 * Записывает сообщение в файл с ротацией
 * @param {string} logDir Директория для логов
 * @param {string} file Имя файла
 * @param {string} message Сообщение для записи
 * @param {number} maxSize Максимальный размер файла в байтах
 */
function writeToFile(logDir, file, message, maxSize = 5 * 1024 * 1024) { // 5MB по умолчанию
  const filePath = path.join(logDir, file);
  
  fs.stat(filePath, (err, stats) => {
    if (err && err.code !== 'ENOENT') {
      console.error(`[Logger Error] Не удалось получить статус файла ${file}: ${err.message}`);
      return;
    }

    if (stats && stats.size >= maxSize) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const archivedFile = `${file}.${timestamp}.log`;
      fs.rename(filePath, path.join(logDir, archivedFile), (renameErr) => {
        if (renameErr) {
          console.error(`[Logger Error] Не удалось архивировать файл ${file}: ${renameErr.message}`);
        }
        appendMessage();
      });
    } else {
      appendMessage();
    }
  });

  function appendMessage() {
    fs.appendFile(filePath, message + '\n', (appendErr) => {
      if (appendErr) {
        console.error(`[Logger Error] Не удалось записать в файл ${file}: ${appendErr.message}`);
      }
    });
  }
}

/**
 * Функция для цветного вывода в консоль
 * @param {string} text Текст для вывода
 * @param {string} color Цвет текста
 * @returns {string} Цветной текст
 */
function colorize(text, color) {
  const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
    },
    bg: {
      black: "\x1b[40m",
      red: "\x1b[41m",
      green: "\x1b[42m",
      yellow: "\x1b[43m",
      blue: "\x1b[44m",
      magenta: "\x1b[45m",
      cyan: "\x1b[46m",
      white: "\x1b[47m",
    },
  };

  return colors.fg[color] + text + colors.reset;
}

module.exports = {
  getTimestamp,
  writeToFile,
  colorize,
};
