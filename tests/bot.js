// bot.js

const { Telegraf } = require('telegraf');
const Logger = require('../src/logger'); // Подключаем ваш кастомный Logger

const BOT_TOKEN = '6812072921:AAGsOp6nTiPFiOx_5tgcCexTnxaPGJNxxD4';

const bot = new Telegraf(BOT_TOKEN);

// Инициализируем логгер с необходимыми настройками
const logger = new Logger({
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
  enableWebServer: true,    // Включить веб-сервер для просмотра логов в реальном времени
  webServerPort: 7000,      // Порт веб-сервера
});

// Используем middleware для логирования входящих обновлений
bot.use((ctx, next) => {
  // Логируем информацию о пользователе и сообщении
  const username = ctx.from ? ctx.from.username : 'unknown';
  const messageText = ctx.message ? ctx.message.text : 'нет текста';
  logger.info(`Получено сообщение от @${username}: ${messageText}`);
  return next();
});

// Пример команды /start
bot.start((ctx) => {
  ctx.reply('Привет! Я бот с расширенным логированием, ротацией логов и маскированием данных.');
  const username = ctx.from ? ctx.from.username : 'unknown';
  logger.info(`Пользователь @${username} запустил бота. Токен: Bearer abc123`);
});

// Пример команды /help
bot.help((ctx) => {
  ctx.reply('Список доступных команд: /start, /help, /silly, /setcolor, /addmask');
  const username = ctx.from ? ctx.from.username : 'unknown';
  logger.verbose(`Пользователь @${username} вызвал команду /help`);
});

// Пример обработки текстового сообщения с паролем
bot.on('text', (ctx) => {
  const username = ctx.from ? ctx.from.username : 'unknown';
  logger.debug(`Получено сообщение от @${username}: password='secret'`);
  // Ваш код обработки сообщения
});

// Пример использования уровня 'silly'
bot.command('silly', (ctx) => {
  const username = ctx.from ? ctx.from.username : 'unknown';
  logger.silly(`Пользователь @${username} вызвал команду /silly`);
  ctx.reply('Это silly команда!');
});

// Пример изменения цвета и префикса динамически
bot.command('setcolor', (ctx) => {
  const username = ctx.from ? ctx.from.username : 'unknown';
  logger.setColor('info', 'cyan');
  logger.setPrefix('info', '[INFORMATION]');
  ctx.reply('Цвет и префикс для info уровня изменены.');
  logger.info(`Цвет и префикс для info уровня изменены пользователем @${username}`);
});

// Пример добавления нового шаблона маскировки
bot.command('addmask', (ctx) => {
  const username = ctx.from ? ctx.from.username : 'unknown';
  logger.addMaskPattern(/api_key\s*=\s*[^\s]+/g);
  ctx.reply('Добавлен новый шаблон маскировки для api_key.');
  logger.info(`Пользователь @${username} добавил новый шаблон маскировки.`);
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
