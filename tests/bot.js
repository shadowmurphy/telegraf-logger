// bot.js

const { Telegraf } = require('telegraf');
const { telegrafLogger } = require('telegraf-logger');

const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';

const bot = new Telegraf(BOT_TOKEN);

// Инициализируем логирование с кастомными настройками и ротацией логов
const logger = telegrafLogger(bot, {
  logDirectory: 'logs', // Путь к директории для сохранения логов (по умолчанию 'logs')
  logLevel: 'verbose',  // Уровень логирования: 'error', 'warn', 'info', 'verbose', 'debug', 'silly' (по умолчанию 'info')
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'blue',
    debug: 'cyan',
    silly: 'magenta',
  },
  prefixes: {
    error: '[ERROR]',
    warn: '[WARN]',
    info: '[INFO]',
    verbose: '[VERBOSE]',
    debug: '[DEBUG]',
    silly: '[SILLY]',
  },
  useEmoji: true,      // Включить эмодзи в префиксах
  maxFileSize: 10 * 1024 * 1024, // 10MB (максимальный размер файла перед ротацией)
  maskPatterns: [     // Шаблоны для маскировки чувствительных данных
    /Bearer\s[^\s]+/g,
    /password\s*=\s*['"][^'"]+['"]/g,
  ],
});

// Пример команды /start
bot.start((ctx) => {
  ctx.reply('Привет! Я бот с расширенным логированием, ротацией логов и маскированием данных.');
  logger.info(`Пользователь @${ctx.from.username} запустил бота. Токен: Bearer abc123`);
});

// Пример команды /help
bot.help((ctx) => {
  ctx.reply('Список доступных команд: /start, /help');
  logger.verbose(`Пользователь @${ctx.from.username} вызвал команду /help`);
});

// Пример обработки текстового сообщения с паролем
bot.on('text', (ctx) => {
  logger.debug(`Получено сообщение от @${ctx.from.username}: password='secret'`);
  // Ваш код обработки сообщения
});

// Пример использования уровня 'silly'
bot.command('silly', (ctx) => {
  logger.silly(`Пользователь @${ctx.from.username} вызвал команду /silly`);
  ctx.reply('Это silly команда!');
});

// Пример изменения цвета и префикса динамически
bot.command('setcolor', (ctx) => {
  logger.setColor('info', 'cyan');
  logger.setPrefix('info', '[INFORMATION]');
  ctx.reply('Цвет и префикс для info уровня изменены.');
  logger.info(`Цвет и префикс для info уровня изменены пользователем @${ctx.from.username}`);
});

// Пример добавления нового шаблона маскировки
bot.command('addmask', (ctx) => {
  logger.addMaskPattern(/api_key\s*=\s*[^\s]+/g);
  ctx.reply('Добавлен новый шаблон маскировки для api_key.');
  logger.info(`Пользователь @${ctx.from.username} добавил новый шаблон маскировки.`);
});

// Запуск бота
bot.launch()
  .then(() => {
    logger.info('Бот успешно запущен.');
  })
  .catch((err) => {
    logger.error(`Не удалось запустить бота: ${err.message}`);
  });

// Обработка сигналов для корректного завершения и закрытия потоков
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  logger.close();
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  logger.close();
});
