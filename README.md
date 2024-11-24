# Telegraf Logger

![npm version](https://img.shields.io/npm/v/@shadowmurphy/telegraf-logger.svg) ![GitHub License](https://img.shields.io/github/license/shadowmurphy/@shadowmurphy/telegraf-logger.svg) ![Node.js Version](https://img.shields.io/node/v/@shadowmurphy/telegraf-logger.svg) ![npm Downloads](https://img.shields.io/npm/dt/@shadowmurphy/telegraf-logger.svg)

**Telegraf Logger** is a powerful and flexible logging solution for Telegram bots built with [Telegraf](https://github.com/telegraf/telegraf), a popular framework for developing Telegram bots in Node.js. This logger provides comprehensive and high-quality logging of events, errors, and other important messages, helping you effectively monitor and debug your bot's operations.

## 📝 Table of Contents

*   [Features](#features)
*   [Installation](#installation)
*   [Quick Start](#quick-start)
    *   [Basic Setup](#basic-setup)
    *   [Advanced Configuration](#advanced-configuration)
*   [Configuration Options](#configuration-options)
*   [API Reference](#api-reference)
*   [Examples](#examples)
    *   [Logging Commands and Messages](#logging-commands-and-messages)
    *   [Masking Sensitive Data](#masking-sensitive-data)
    *   [Dynamic Configuration](#dynamic-configuration)
*   [Contributing](#contributing)
*   [License](#license)
*   [Contact](#contact)
*   [Sample Logs](#sample-logs)
*   [Statistics](#statistics)
*   [Updates](#updates)

## ✨ Features

*   **Multiple Log Levels**: Supports `error`, `warn`, `info`, `verbose`, `debug`, and `silly` levels.
*   **Color-Coded Console Output**: Easily distinguish log levels with customizable colors.
*   **Prefixes and Emojis**: Add prefixes and optional emojis to log messages for better readability.
*   **Log Rotation**: Automatically rotate log files when they reach a specified size to prevent disk overflow.
*   **Sensitive Data Masking**: Protect sensitive information by masking predefined patterns in log messages.
*   **Module Tagging**: Tag logs with module identifiers for better organization.
*   **Seamless Telegraf Integration**: Automatically logs incoming updates, commands, messages, and errors.

## 📦 Installation

Install the package via npm:

```
npm install @shadowmurphy/telegraf-logger
```

## 🚀 Quick Start

### Basic Setup

Create a `bot.js` file in your project directory and initialize your Telegraf bot with the logger:

```
const { Telegraf } = require('telegraf');
const { telegrafLogger } = require('@shadowmurphy/telegraf-logger');

const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';

const bot = new Telegraf(BOT_TOKEN);

// Initialize the logger with default settings
const logger = telegrafLogger(bot, {
  logDirectory: 'logs',       // Directory to save logs (default: 'logs')
  logLevel: 'info',           // Logging level: 'error', 'warn', 'info', 'verbose', 'debug', 'silly' (default: 'info')
  colors: {                    // Customize colors for each log level
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'blue',
    debug: 'cyan',
    silly: 'magenta',
  },
  prefixes: {                  // Customize prefixes for each log level
    error: '[ERROR]',
    warn: '[WARN]',
    info: '[INFO]',
    verbose: '[VERBOSE]',
    debug: '[DEBUG]',
    silly: '[SILLY]',
  },
  useEmoji: true,             // Enable emojis in prefixes (default: false)
  maxFileSize: 10 * 1024 * 1024, // Max log file size before rotation (default: 10MB)
  maskPatterns: [             // Patterns to mask sensitive data
    /Bearer\s[^\s]+/g,        // Mask access tokens
    /password\s*=\s*['"][^'"]+['"]/g, // Mask passwords
  ],
  moduleTag: 'botModule',     // Tag logs with module name (default: '')
});
```

### Advanced Configuration

Customize the logger further by adjusting colors, prefixes, log levels, and adding new mask patterns as needed.

```
// Change log level to 'debug'
logger.setLogLevel('debug');

// Disable emojis in prefixes
logger.setUseEmoji(false);

// Add a new mask pattern for API keys
logger.addMaskPattern(/api_key\s*=\s*[^\s]+/g);

// Set a module tag
logger.setModuleTag('authentication');
```

## 🛠 Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `logDirectory` | `string` | `'logs'` | Directory where log files will be stored. |
| `logLevel` | `string` | `'info'` | Logging level. Options: `'error'`, `'warn'`, `'info'`, `'verbose'`, `'debug'`, `'silly'`. |
| `colors` | `object` | Default colors as shown in the [Basic Setup](#basic-setup) section. | Customize console colors for each log level. |
| `prefixes` | `object` | Default prefixes as shown in the [Basic Setup](#basic-setup) section. | Customize prefixes for each log level. |
| `useEmoji` | `boolean` | `false` | Enable or disable emojis in log prefixes. |
| `maxFileSize` | `number` | `10 * 1024 * 1024` (10MB) | Maximum size of a log file before rotation occurs. |
| `maskPatterns` | `Array<RegExp>` | Default patterns as shown in the [Basic Setup](#basic-setup) section. | Array of regex patterns to mask sensitive information in logs. |
| `moduleTag` | `string` | `''` | Tag to identify logs from different modules or parts of the application. |

## 🔍 API Reference

### telegrafLogger(bot, options)

Integrates the logger with a Telegraf bot.

*   **Parameters:**
    *   `bot` (`Telegraf`): An instance of a Telegraf bot.
    *   `options` (`object`): Configuration options (see [Configuration Options](#configuration-options)).
*   **Returns:** `Logger` instance.

```
const logger = telegrafLogger(bot, { /* options */ });
```

### Logger Class

The `Logger` class provides methods for logging and configuration.

#### Methods

| Method | Description |
| --- | --- |
| `info(message)` | Log an informational message. |
| `warn(message)` | Log a warning message. |
| `error(message)` | Log an error message. |
| `verbose(message)` | Log a verbose message. |
| `debug(message)` | Log a debug message. |
| `silly(message)` | Log a silly message with the highest verbosity. |
| `setColor(level, color)` | Set the console color for a specific log level. |
| `setPrefix(level, prefix)` | Set the prefix for a specific log level. |
| `setLogLevel(level)` | Change the current log level. |
| `setUseEmoji(useEmoji)` | Enable or disable emojis in log prefixes. |
| `setMaxFileSize(maxSize)` | Set the maximum log file size before rotation. |
| `addMaskPattern(pattern)` | Add a new regex pattern to mask sensitive data in logs. |
| `setModuleTag(tag)` | Set a module tag to identify logs from specific modules. |
| `close()` | Close all log file streams gracefully. |

## 🎉 Examples

### Logging Commands and Messages

```
bot.command('start', (ctx) => {
  ctx.reply('Welcome! I am your friendly Telegram bot.');
  logger.info(`User @${ctx.from.username} started the bot.`);
});

bot.on('text', (ctx) => {
  const userMessage = ctx.message.text;
  logger.debug(`Message from @${ctx.from.username}: ${userMessage}`);
  // Handle the message...
});
```

### Masking Sensitive Data

```
bot.command('login', (ctx) => {
  const token = 'Bearer abc123def456';
  logger.info(`User @${ctx.from.username} logged in with token: ${token}`);
  // Authentication logic...
});

// In logs, the token will be masked as [MASKED]
```

### Dynamic Configuration

```
bot.command('enableDebug', (ctx) => {
  logger.setLogLevel('debug');
  ctx.reply('Debug logging enabled.');
  logger.debug('Debugging is now active.');
});

bot.command('disableEmojis', (ctx) => {
  logger.setUseEmoji(false);
  ctx.reply('Emojis in log prefixes have been disabled.');
  logger.info('Emojis are now disabled in log prefixes.');
});
```

## 🤝 Contributing

We welcome contributions! Please follow these steps to contribute:

1.  **Fork the Repository**
    
    Click the [Fork](https://github.com/shadowmurphy/@shadowmurphy/telegraf-logger/fork) button at the top right of the repository page.
    
2.  **Clone Your Fork**
    
    ```
    git clone https://github.com/shadowmurphy/@shadowmurphy/telegraf-logger.git
    cd @shadowmurphy/telegraf-logger
    ```
    
3.  **Create a New Branch**
    
    ```
    git checkout -b feature/YourFeature
    ```
    
4.  **Make Your Changes**
    
    Implement your feature or fix bugs as needed.
    
5.  **Commit Your Changes**
    
    ```
    git commit -m "Add feature: YourFeature"
    ```
    
6.  **Push to Your Fork**
    
    ```
    git push origin feature/YourFeature
    ```
    
7.  **Open a Pull Request**
    
    Navigate to the original repository and click the **Compare & pull request** button.
    

## 🛡 License

This project is licensed under the [MIT License](LICENSE).

## 📫 Contact

For any questions, suggestions, or feedback, feel free to:

*   Open an [issue](https://github.com/shadowmurphy/@shadowmurphy/telegraf-logger/issues) on GitHub.
*   Contact the author via [email](mailto:contact@kyrylo.work).

## 📄 Sample Logs

### Console Output with Emojis and Colors

```
2024-04-27 12:34:56 ❌ [ERROR]: [authModule] Failed to authenticate user @john_doe.
2024-04-27 12:35:00 ⚠️ [WARN]: [botModule] User @jane_doe is using an outdated method.
2024-04-27 12:35:05 ℹ️ [INFO]: [botModule] Bot successfully launched.
2024-04-27 12:35:10 🔍 [VERBOSE]: [botModule] Received update: { ... }
2024-04-27 12:35:15 🐞 [DEBUG]: [botModule] Message from @john_doe: Hello!
2024-04-27 12:35:20 🎉 [SILLY]: [botModule] User @jane_doe invoked /silly command.
```

### Combined Log File (`combined.log`)

```
2024-04-27 12:34:56 [ERROR]: [authModule] Failed to authenticate user @john_doe.
2024-04-27 12:35:00 [WARN]: [botModule] User @jane_doe is using an outdated method.
2024-04-27 12:35:05 [INFO]: [botModule] Bot successfully launched.
2024-04-27 12:35:10 [VERBOSE]: [botModule] Received update: { ... }
2024-04-27 12:35:15 [DEBUG]: [botModule] Message from @john_doe: Hello!
2024-04-27 12:35:20 [SILLY]: [botModule] User @jane_doe invoked /silly command.
```

## 📈 Statistics

![npm downloads](https://img.shields.io/npm/dt/@shadowmurphy/telegraf-logger.svg) ![GitHub issues](https://img.shields.io/github/issues/shadowmurphy/@shadowmurphy/telegraf-logger.svg) ![GitHub pull requests](https://img.shields.io/github/issues-pr/shadowmurphy/@shadowmurphy/telegraf-logger.svg)

## 📢 Updates

Stay updated with the latest changes in the [GitHub repository](https://github.com/shadowmurphy/@shadowmurphy/telegraf-logger).

- - -

Thank you for using **Telegraf Logger**! If you find this package useful, please consider giving it a ⭐ on [GitHub](https://github.com/shadowmurphy/@shadowmurphy/telegraf-logger) and sharing it with other developers.