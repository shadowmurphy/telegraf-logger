// bot.js

const { Telegraf } = require('telegraf');
const Logger = require('../src/logger'); // Adjust the path if necessary

const BOT_TOKEN = '6812072921:AAGsOp6nTiPFiOx_5tgcCexTnxaPGJNxxD4';

const bot = new Telegraf(BOT_TOKEN);

const logger = new Logger({
  logDirectory: 'logs',
  logLevel: 'silly',
  useEmoji: true,
  maxFileSize: 10 * 1024 * 1024,
  maskPatterns: [
    /Bearer\s[^\s]+/g,
    /password\s*=\s*['"][^'"]+['"]/g,
  ],
  enableWebServer: true,
  webServerPort: 4000,
  users: [
    { username: 'admin', password: 'adminpass' },
  ],
});

bot.command('adduser', async (ctx) => {
  const args = ctx.message.text.split(' ');
  if (args.length !== 3) {
    ctx.reply('Usage: /adduser <username> <password>');
    return;
  }
  const username = args[1];
  const password = args[2];
  const userAdded = await logger.createUser(username, password);
  if (userAdded) {
    ctx.reply(`User '${username}' added successfully.`);
    logger.info(`User '${username}' added by bot command.`);
  } else {
    ctx.reply(`User '${username}' already exists.`);
    logger.warn(`Attempt to add existing user '${username}'.`);
  }
});

bot.use((ctx, next) => {
  const username = ctx.from ? ctx.from.username : 'unknown';
  const messageText = ctx.message ? ctx.message.text : 'no text';
  logger.info(`Received message from @${username}: ${messageText}`);
  return next();
});

bot.start((ctx) => {
  ctx.reply('Hello! This is a bot with advanced logging.');
  const username = ctx.from ? ctx.from.username : 'unknown';
  logger.info(`User @${username} started the bot.`);
});

bot.help((ctx) => {
  ctx.reply('Available commands: /start, /help, /silly, /setcolor, /addmask, /adduser, /testlogs');
  const username = ctx.from ? ctx.from.username : 'unknown';
  logger.verbose(`User @${username} requested help.`);
});

bot.on('text', (ctx) => {
  const username = ctx.from ? ctx.from.username : 'unknown';
  logger.debug(`Received text from @${username}: ${ctx.message.text}`);
});

bot.command('silly', (ctx) => {
  const username = ctx.from ? ctx.from.username : 'unknown';
  logger.silly(`User @${username} invoked /silly command.`);
  ctx.reply('This is a silly command!');
});

bot.command('setcolor', (ctx) => {
  const username = ctx.from ? ctx.from.username : 'unknown';
  logger.setColor('info', 'cyan');
  logger.setPrefix('info', '[INFORMATION]');
  ctx.reply('Changed color and prefix for info level.');
  logger.info(`User @${username} changed the info level color and prefix.`);
});

bot.command('addmask', (ctx) => {
  const username = ctx.from ? ctx.from.username : 'unknown';
  logger.addMaskPattern(/api_key\s*=\s*[^\s]+/g);
  ctx.reply('Added a new mask pattern for api_key.');
  logger.info(`User @${username} added a new mask pattern.`);
});

bot.command('testlogs', (ctx) => {
  logger.error('This is an error message.');
  logger.warn('This is a warning message.');
  logger.info('This is an info message.');
  logger.verbose('This is a verbose message.');
  logger.debug('This is a debug message.');
  logger.silly('This is a silly message.');
  ctx.reply('All log levels have been tested.');
});

bot.launch()
  .then(() => {
    logger.info('Bot started successfully.');
  })
  .catch((err) => {
    logger.error(`Failed to start bot: ${err.message}`);
  });

process.once('SIGINT', () => {
  bot.stop('SIGINT');
  logger.close();
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  logger.close();
});
