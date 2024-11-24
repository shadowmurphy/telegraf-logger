const Logger = require('./logger');

/**
 * Интеграция логирования с Telegraf
 * @param {import('telegraf').Telegraf} bot - Экземпляр Telegraf бота
 * @param {Object} [options] - Опции для логирования
 * @param {string} [options.logDirectory] - Путь к директории для сохранения логов
 * @param {string} [options.logLevel] - Уровень логирования ('info', 'debug', 'error', 'warn')
 * @returns {Logger} - Экземпляр Logger
 */
function telegrafLogger(bot, options = {}) {
  const logger = new Logger(options);

  // Логирование входящих обновлений
  bot.use(async (ctx, next) => {
    logger.info(`Получено обновление: ${JSON.stringify(ctx.update)}`);
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

  return logger;
}

module.exports = {
  telegrafLogger
};
