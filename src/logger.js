// src/logger.js

const fs = require('fs');
const path = require('path');
const { getTimestamp, writeToFile, colorize } = require('./utils');

/**
 * @typedef {Object} LoggerOptions
 * @property {string} [logDirectory] - Путь к директории для сохранения логов
 * @property {string} [logLevel] - Уровень логирования ('error', 'warn', 'info', 'verbose', 'debug', 'silly')
 * @property {Object} [colors] - Объект с цветами для различных уровней
 * @property {Object} [prefixes] - Объект с префиксами для различных уровней
 * @property {boolean} [useEmoji] - Использовать эмодзи в префиксах
 * @property {number} [maxFileSize] - Максимальный размер файла логов в байтах (по умолчанию 5MB)
 * @property {Array<RegExp>} [maskPatterns] - Массив регулярных выражений для маскировки данных
 * @property {string} [moduleTag] - Тег модуля для фильтрации логов
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
    this.colors = options.colors || {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      verbose: 'blue',
      debug: 'cyan',
      silly: 'magenta',
    };
    this.prefixes = options.prefixes || {
      error: '[ERROR]',
      warn: '[WARN]',
      info: '[INFO]',
      verbose: '[VERBOSE]',
      debug: '[DEBUG]',
      silly: '[SILLY]',
    };
    this.useEmoji = options.useEmoji || false;
    this.maxFileSize = options.maxFileSize || 5 * 1024 * 1024; // 5MB
    this.maskPatterns = options.maskPatterns || []; // Массив RegExp
    this.moduleTag = options.moduleTag || ''; // Тег модуля

    // Создаём папку для логов, если её нет
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }

    // Расширенные уровни логирования
    this.levels = {
      'error': 0,
      'warn': 1,
      'info': 2,
      'verbose': 3,
      'debug': 4,
      'silly': 5,
    };

    this.currentLevel = this.levels[this.logLevel] !== undefined ? this.levels[this.logLevel] : 2;

    // Кэш для потоков записи
    this.streams = {};

    // Инициализируем потоки для каждого уровня
    Object.keys(this.levels).forEach((level) => {
      this.streams[level] = fs.createWriteStream(
        path.join(this.logDirectory, `${level}.log`),
        { flags: 'a' }
      );
    });
    this.streams['combined'] = fs.createWriteStream(
      path.join(this.logDirectory, 'combined.log'),
      { flags: 'a' }
    );
    this.streams['exceptions'] = fs.createWriteStream(
      path.join(this.logDirectory, 'exceptions.log'),
      { flags: 'a' }
    );
  }

  /**
   * Применяет маскировку к сообщению
   * @param {string} message Сообщение для маскировки
   * @returns {string} Маскированное сообщение
   */
  applyMasking(message) {
    let maskedMessage = message;
    this.maskPatterns.forEach((pattern) => {
      maskedMessage = maskedMessage.replace(pattern, '[MASKED]');
    });
    return maskedMessage;
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
      // Применяем маскировку к сообщению
      const maskedMessage = this.applyMasking(message);

      const timestamp = getTimestamp();
      let prefix = this.prefixes[level] || `[${level.toUpperCase()}]`;

      // Добавление эмодзи, если включено
      if (this.useEmoji) {
        const emojis = {
          error: '❌',
          warn: '⚠️',
          info: 'ℹ️',
          verbose: '🔍',
          debug: '🐞',
          silly: '🎉',
        };
        prefix = `${emojis[level] || ''} ${prefix}`;
      }

      // Добавление тега модуля, если он установлен
      const moduleInfo = this.moduleTag ? `[${this.moduleTag}] ` : '';

      const color = this.colors[level] || 'white';
      const formattedMessage = `${timestamp} ${prefix}: ${moduleInfo}${maskedMessage}`;

      // Запись в консоль с цветом
      console.log(colorize(formattedMessage, color));

      // Запись в файл через поток
      this.writeToStream(level, formattedMessage);
      this.writeToStream('combined', formattedMessage);
    }
  }

  /**
   * Запись сообщения в поток
   * @param {string} streamName Имя потока
   * @param {string} message Сообщение для записи
   */
  writeToStream(streamName, message) {
    if (this.streams[streamName]) {
      this.streams[streamName].write(message + '\n');
    } else {
      // Если поток не существует, создаём его
      const filePath = path.join(this.logDirectory, `${streamName}.log`);
      this.streams[streamName] = fs.createWriteStream(filePath, { flags: 'a' });
      this.streams[streamName].write(message + '\n');
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
   * Логирование детальной информации
   * @param {string} message Сообщение для логирования
   */
  verbose(message) {
    this.log('verbose', message);
  }

  /**
   * Логирование отладочной информации
   * @param {string} message Сообщение для логирования
   */
  debug(message) {
    this.log('debug', message);
  }

  /**
   * Логирование очень детальной информации
   * @param {string} message Сообщение для логирования
   */
  silly(message) {
    this.log('silly', message);
  }

  /**
   * Установка цвета для конкретного уровня
   * @param {string} level Уровень
   * @param {string} color Цвет (например, 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white')
   */
  setColor(level, color) {
    if (this.colors[level]) {
      this.colors[level] = color;
    }
  }

  /**
   * Установка префикса для конкретного уровня
   * @param {string} level Уровень
   * @param {string} prefix Префикс (например, '[ERROR]')
   */
  setPrefix(level, prefix) {
    if (this.prefixes[level]) {
      this.prefixes[level] = prefix;
    }
  }

  /**
   * Установка уровня логирования
   * @param {string} level Уровень ('error', 'warn', 'info', 'verbose', 'debug', 'silly')
   */
  setLogLevel(level) {
    if (this.levels[level] !== undefined) {
      this.logLevel = level;
      this.currentLevel = this.levels[level];
    }
  }

  /**
   * Включение или отключение эмодзи в префиксах
   * @param {boolean} useEmoji
   */
  setUseEmoji(useEmoji) {
    this.useEmoji = useEmoji;
  }

  /**
   * Установка максимального размера файла логов
   * @param {number} maxSize Максимальный размер в байтах
   */
  setMaxFileSize(maxSize) {
    if (typeof maxSize === 'number' && maxSize > 0) {
      this.maxFileSize = maxSize;
    }
  }

  /**
   * Добавление шаблона для маскировки данных
   * @param {RegExp} pattern Регулярное выражение для поиска
   */
  addMaskPattern(pattern) {
    if (pattern instanceof RegExp) {
      this.maskPatterns.push(pattern);
    }
  }

  /**
   * Установка тега модуля
   * @param {string} tag Тег модуля
   */
  setModuleTag(tag) {
    this.moduleTag = tag;
  }

  /**
   * Закрытие всех потоков при завершении работы
   */
  close() {
    Object.values(this.streams).forEach((stream) => {
      stream.end();
    });
  }
}

module.exports = Logger;
