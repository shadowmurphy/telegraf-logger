// src/index.js

const Logger = require('./logger');

/**
 * Интеграция логирования с Telegraf
 * @param {import('telegraf').Telegraf} bot - Экземпляр Telegraf бота
 * @param {Object} [options] - Опции для логирования
 * @param {string} [options.logDirectory] - Путь к директории для сохранения логов
 * @param {string} [options.logLevel] - Уровень логирования ('error', 'warn', 'info', 'verbose', 'debug', 'silly')
 * @param {Object} [options.colors] - Объект с цветами для различных уровней
 * @param {Object} [options.prefixes] - Объект с префиксами для различных уровней
 * @param {boolean} [options.useEmoji] - Использовать эмодзи в префиксах
 * @param {number} [options.maxFileSize] - Максимальный размер файла логов в байтах
 * @param {Array<RegExp>} [options.maskPatterns] - Массив регулярных выражений для маскировки данных
 * @param {string} [options.moduleTag] - Тег модуля для фильтрации логов
 * @returns {Logger} - Экземпляр Logger
 */
function telegrafLogger(bot, options = {}) {
  const logger = new Logger(options);

  // Логирование входящих обновлений
  bot.use(async (ctx, next) => {
    logger.info(`Получено обновление: ${JSON.stringify()}`);
    try {
      await next();
      logger.info(`Обработано обновление: ${ctx.update.update_id}`);
    } catch (err) {
      logger.error(`Ошибка при обработке обновления ${ctx.update.update_id}: ${err.message}`);
      throw err;
    }
  });

  // Логирование ошибок
  bot.catch((err, ctx) => {
    logger.error(`Ошибка бота для обновления ${ctx.update.update_id}: ${err.message}`);
  });

  // Логирование команд и сообщений
  bot.on('text', (ctx, next) => {
    const messageText = ctx.message.text;
    if (messageText.startsWith('/')) {
      logger.info(`Вызвана команда: ${messageText} от пользователя @${ctx.from.username}`);
    } else {
      logger.debug(`Получено сообщение от @${ctx.from.username}: ${messageText}`);
    }
    return next();
  });

  // Логирование запросов к API (callback_query)
  bot.on('callback_query', (ctx) => {
    logger.verbose(`Получен callback_query от @${ctx.from.username}: ${JSON.stringify(ctx.callbackQuery)}`);
  });

  // Дополнительные обработчики событий могут быть добавлены здесь

  return logger;
}

module.exports = {
  telegrafLogger,
};
