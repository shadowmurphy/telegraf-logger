const fs = require('fs');
const path = require('path');
const { getTimestamp, writeToFile } = require('./utils');

/**
 * @typedef {Object} LoggerOptions
 * @property {string} [logDirectory] - Путь к директории для сохранения логов
 * @property {string} [logLevel] - Уровень логирования ('info', 'debug', 'error', 'warn')
 */

/**
 * Класс Logger для управления логированием
 */
class Logger {
  /**
   * Создаёт экземпляр Logger
   * @param {LoggerOptions} [options] - Опции для логирования
   */
  constructor(options = {}) {
    this.logDirectory = options.logDirectory || 'logs';
    this.logLevel = options.logLevel || 'info';

    // Создаём папку для логов, если её нет
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }

    // Уровни логирования
    this.levels = {
      'error': 0,
      'warn': 1,
      'info': 2,
      'debug': 3
    };

    this.currentLevel = this.levels[this.logLevel] !== undefined ? this.levels[this.logLevel] : 2;
  }

  /**
   * Проверяет, нужно ли логировать сообщение данного уровня
   * @param {string} level Уровень сообщения
   * @returns {boolean}
   */
  shouldLog(level) {
    return this.levels[level] <= this.currentLevel;
  }

  /**
   * Логирование сообщения
   * @param {string} level Уровень сообщения
   * @param {string} message Сообщение для логирования
   */
  log(level, message) {
    if (this.shouldLog(level)) {
      const timestamp = getTimestamp();
      const formattedMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
      
      // Запись в консоль
      switch(level) {
        case 'error':
          console.error(formattedMessage);
          break;
        case 'warn':
          console.warn(formattedMessage);
          break;
        case 'info':
          console.info(formattedMessage);
          break;
        case 'debug':
          console.debug(formattedMessage);
          break;
        default:
          console.log(formattedMessage);
      }

      // Запись в файл
      writeToFile(this.logDirectory, `${level}.log`, formattedMessage);
      writeToFile(this.logDirectory, `combined.log`, formattedMessage);
    }
  }

  /**
   * Логирование информации
   * @param {string} message Сообщение для логирования
   */
  info(message) {
    this.log('info', message);
  }

  /**
   * Логирование предупреждений
   * @param {string} message Сообщение для логирования
   */
  warn(message) {
    this.log('warn', message);
  }

  /**
   * Логирование ошибок
   * @param {string} message Сообщение для логирования
   */
  error(message) {
    this.log('error', message);
  }

  /**
   * Логирование отладочной информации
   * @param {string} message Сообщение для логирования
   */
  debug(message) {
    this.log('debug', message);
  }
}

module.exports = Logger;
