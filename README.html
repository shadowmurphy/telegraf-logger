<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Telegraf Logger</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
      color: #333;
    }
    .container {
      max-width: 960px;
      margin: auto;
      background: #fff;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1, h2, h3, h4 {
      color: #444;
    }
    pre {
      background: #f4f4f4;
      padding: 10px;
      border-radius: 5px;
      overflow-x: auto;
    }
    code {
      background: #f4f4f4;
      padding: 2px 4px;
      border-radius: 3px;
    }
    ul {
      list-style-type: disc;
      margin-left: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f4f4f4;
    }
    .badges img {
      margin-right: 10px;
      vertical-align: middle;
    }
    a {
      color: #1e90ff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Telegraf Logger</h1>
    <div class="badges">
      <img src="https://img.shields.io/npm/v/telegraf-logger.svg" alt="npm version">
      <img src="https://img.shields.io/github/license/shadowmurphy/telegraf-logger.svg" alt="GitHub License">
      <img src="https://img.shields.io/node/v/telegraf-logger.svg" alt="Node.js Version">
      <img src="https://img.shields.io/npm/dt/telegraf-logger.svg" alt="npm Downloads">
    </div>
    
    <p><strong>Telegraf Logger</strong> is a powerful and flexible logging solution for Telegram bots built with <a href="https://github.com/telegraf/telegraf" target="_blank">Telegraf</a>, a popular framework for developing Telegram bots in Node.js. This logger provides comprehensive and high-quality logging of events, errors, and other important messages, helping you effectively monitor and debug your bot's operations.</p>
    
    <h2>📝 Table of Contents</h2>
    <ul>
      <li><a href="#features">Features</a></li>
      <li><a href="#installation">Installation</a></li>
      <li><a href="#quick-start">Quick Start</a>
        <ul>
          <li><a href="#basic-setup">Basic Setup</a></li>
          <li><a href="#advanced-configuration">Advanced Configuration</a></li>
        </ul>
      </li>
      <li><a href="#configuration-options">Configuration Options</a></li>
      <li><a href="#api-reference">API Reference</a></li>
      <li><a href="#examples">Examples</a>
        <ul>
          <li><a href="#logging-commands-and-messages">Logging Commands and Messages</a></li>
          <li><a href="#masking-sensitive-data">Masking Sensitive Data</a></li>
          <li><a href="#dynamic-configuration">Dynamic Configuration</a></li>
        </ul>
      </li>
      <li><a href="#contributing">Contributing</a></li>
      <li><a href="#license">License</a></li>
      <li><a href="#contact">Contact</a></li>
      <li><a href="#sample-logs">Sample Logs</a></li>
      <li><a href="#statistics">Statistics</a></li>
      <li><a href="#updates">Updates</a></li>
    </ul>
    
    <h2>✨ Features</h2>
    <ul>
      <li><strong>Multiple Log Levels</strong>: Supports <code>error</code>, <code>warn</code>, <code>info</code>, <code>verbose</code>, <code>debug</code>, and <code>silly</code> levels.</li>
      <li><strong>Color-Coded Console Output</strong>: Easily distinguish log levels with customizable colors.</li>
      <li><strong>Prefixes and Emojis</strong>: Add prefixes and optional emojis to log messages for better readability.</li>
      <li><strong>Log Rotation</strong>: Automatically rotate log files when they reach a specified size to prevent disk overflow.</li>
      <li><strong>Sensitive Data Masking</strong>: Protect sensitive information by masking predefined patterns in log messages.</li>
      <li><strong>Module Tagging</strong>: Tag logs with module identifiers for better organization.</li>
      <li><strong>Seamless Telegraf Integration</strong>: Automatically logs incoming updates, commands, messages, and errors.</li>
    </ul>
    
    <h2>📦 Installation</h2>
    <p>Install the package via npm:</p>
    <pre><code>npm install telegraf-logger</code></pre>
    
    <h2>🚀 Quick Start</h2>
    <h3 id="basic-setup">Basic Setup</h3>
    <p>Create a <code>bot.js</code> file in your project directory and initialize your Telegraf bot with the logger:</p>
    <pre><code>const { Telegraf } = require('telegraf');
const { telegrafLogger } = require('telegraf-logger');

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
</code></pre>
    
    <h3 id="advanced-configuration">Advanced Configuration</h3>
    <p>Customize the logger further by adjusting colors, prefixes, log levels, and adding new mask patterns as needed.</p>
    <pre><code>// Change log level to 'debug'
logger.setLogLevel('debug');

// Disable emojis in prefixes
logger.setUseEmoji(false);

// Add a new mask pattern for API keys
logger.addMaskPattern(/api_key\s*=\s*[^\s]+/g);

// Set a module tag
logger.setModuleTag('authentication');
</code></pre>
    
    <h2>🛠 Configuration Options</h2>
    <table>
      <thead>
        <tr>
          <th>Option</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>logDirectory</code></td>
          <td><code>string</code></td>
          <td><code>'logs'</code></td>
          <td>Directory where log files will be stored.</td>
        </tr>
        <tr>
          <td><code>logLevel</code></td>
          <td><code>string</code></td>
          <td><code>'info'</code></td>
          <td>Logging level. Options: <code>'error'</code>, <code>'warn'</code>, <code>'info'</code>, <code>'verbose'</code>, <code>'debug'</code>, <code>'silly'</code>.</td>
        </tr>
        <tr>
          <td><code>colors</code></td>
          <td><code>object</code></td>
          <td>Default colors as shown in the <a href="#basic-setup">Basic Setup</a> section.</td>
          <td>Customize console colors for each log level.</td>
        </tr>
        <tr>
          <td><code>prefixes</code></td>
          <td><code>object</code></td>
          <td>Default prefixes as shown in the <a href="#basic-setup">Basic Setup</a> section.</td>
          <td>Customize prefixes for each log level.</td>
        </tr>
        <tr>
          <td><code>useEmoji</code></td>
          <td><code>boolean</code></td>
          <td><code>false</code></td>
          <td>Enable or disable emojis in log prefixes.</td>
        </tr>
        <tr>
          <td><code>maxFileSize</code></td>
          <td><code>number</code></td>
          <td><code>10 * 1024 * 1024</code> (10MB)</td>
          <td>Maximum size of a log file before rotation occurs.</td>
        </tr>
        <tr>
          <td><code>maskPatterns</code></td>
          <td><code>Array&lt;RegExp&gt;</code></td>
          <td>Default patterns as shown in the <a href="#basic-setup">Basic Setup</a> section.</td>
          <td>Array of regex patterns to mask sensitive information in logs.</td>
        </tr>
        <tr>
          <td><code>moduleTag</code></td>
          <td><code>string</code></td>
          <td><code>''</code></td>
          <td>Tag to identify logs from different modules or parts of the application.</td>
        </tr>
      </tbody>
    </table>
    
    <h2>🔍 API Reference</h2>
    <h3>telegrafLogger(bot, options)</h3>
    <p>Integrates the logger with a Telegraf bot.</p>
    <ul>
      <li><strong>Parameters:</strong>
        <ul>
          <li><code>bot</code> (<code>Telegraf</code>): An instance of a Telegraf bot.</li>
          <li><code>options</code> (<code>object</code>): Configuration options (see <a href="#configuration-options">Configuration Options</a>).</li>
        </ul>
      </li>
      <li><strong>Returns:</strong> <code>Logger</code> instance.</li>
    </ul>
    <pre><code>const logger = telegrafLogger(bot, { /* options */ });
</code></pre>
    
    <h3>Logger Class</h3>
    <p>The <code>Logger</code> class provides methods for logging and configuration.</p>
    
    <h4>Methods</h4>
    <table>
      <thead>
        <tr>
          <th>Method</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>info(message)</code></td>
          <td>Log an informational message.</td>
        </tr>
        <tr>
          <td><code>warn(message)</code></td>
          <td>Log a warning message.</td>
        </tr>
        <tr>
          <td><code>error(message)</code></td>
          <td>Log an error message.</td>
        </tr>
        <tr>
          <td><code>verbose(message)</code></td>
          <td>Log a verbose message.</td>
        </tr>
        <tr>
          <td><code>debug(message)</code></td>
          <td>Log a debug message.</td>
        </tr>
        <tr>
          <td><code>silly(message)</code></td>
          <td>Log a silly message with the highest verbosity.</td>
        </tr>
        <tr>
          <td><code>setColor(level, color)</code></td>
          <td>Set the console color for a specific log level.</td>
        </tr>
        <tr>
          <td><code>setPrefix(level, prefix)</code></td>
          <td>Set the prefix for a specific log level.</td>
        </tr>
        <tr>
          <td><code>setLogLevel(level)</code></td>
          <td>Change the current log level.</td>
        </tr>
        <tr>
          <td><code>setUseEmoji(useEmoji)</code></td>
          <td>Enable or disable emojis in log prefixes.</td>
        </tr>
        <tr>
          <td><code>setMaxFileSize(maxSize)</code></td>
          <td>Set the maximum log file size before rotation.</td>
        </tr>
        <tr>
          <td><code>addMaskPattern(pattern)</code></td>
          <td>Add a new regex pattern to mask sensitive data in logs.</td>
        </tr>
        <tr>
          <td><code>setModuleTag(tag)</code></td>
          <td>Set a module tag to identify logs from specific modules.</td>
        </tr>
        <tr>
          <td><code>close()</code></td>
          <td>Close all log file streams gracefully.</td>
        </tr>
      </tbody>
    </table>
    
    <h2>🎉 Examples</h2>
    <h3 id="logging-commands-and-messages">Logging Commands and Messages</h3>
    <pre><code>bot.command('start', (ctx) => {
  ctx.reply('Welcome! I am your friendly Telegram bot.');
  logger.info(`User @${ctx.from.username} started the bot.`);
});

bot.on('text', (ctx) => {
  const userMessage = ctx.message.text;
  logger.debug(`Message from @${ctx.from.username}: ${userMessage}`);
  // Handle the message...
});
</code></pre>
    
    <h3 id="masking-sensitive-data">Masking Sensitive Data</h3>
    <pre><code>bot.command('login', (ctx) => {
  const token = 'Bearer abc123def456';
  logger.info(`User @${ctx.from.username} logged in with token: ${token}`);
  // Authentication logic...
});

// In logs, the token will be masked as [MASKED]
</code></pre>
    
    <h3 id="dynamic-configuration">Dynamic Configuration</h3>
    <pre><code>bot.command('enableDebug', (ctx) => {
  logger.setLogLevel('debug');
  ctx.reply('Debug logging enabled.');
  logger.debug('Debugging is now active.');
});

bot.command('disableEmojis', (ctx) => {
  logger.setUseEmoji(false);
  ctx.reply('Emojis in log prefixes have been disabled.');
  logger.info('Emojis are now disabled in log prefixes.');
});
</code></pre>
    
    <h2>🤝 Contributing</h2>
    <p>We welcome contributions! Please follow these steps to contribute:</p>
    <ol>
      <li><strong>Fork the Repository</strong>
        <p>Click the <a href="https://github.com/shadowmurphy/telegraf-logger/fork" target="_blank">Fork</a> button at the top right of the repository page.</p>
      </li>
      <li><strong>Clone Your Fork</strong>
        <pre><code>git clone https://github.com/shadowmurphy/telegraf-logger.git
cd telegraf-logger
</code></pre>
      </li>
      <li><strong>Create a New Branch</strong>
        <pre><code>git checkout -b feature/YourFeature
</code></pre>
      </li>
      <li><strong>Make Your Changes</strong>
        <p>Implement your feature or fix bugs as needed.</p>
      </li>
      <li><strong>Commit Your Changes</strong>
        <pre><code>git commit -m "Add feature: YourFeature"
</code></pre>
      </li>
      <li><strong>Push to Your Fork</strong>
        <pre><code>git push origin feature/YourFeature
</code></pre>
      </li>
      <li><strong>Open a Pull Request</strong>
        <p>Navigate to the original repository and click the <strong>Compare & pull request</strong> button.</p>
      </li>
    </ol>
    
    <h2>🛡 License</h2>
    <p>This project is licensed under the <a href="LICENSE" target="_blank">MIT License</a>.</p>
    
    <h2>📫 Contact</h2>
    <p>For any questions, suggestions, or feedback, feel free to:</p>
    <ul>
      <li>Open an <a href="https://github.com/shadowmurphy/telegraf-logger/issues" target="_blank">issue</a> on GitHub.</li>
      <li>Contact the author via <a href="mailto:contact@kyrylo.work">email</a>.</li>
    </ul>
    
    <h2 id="sample-logs">📄 Sample Logs</h2>
    <h3>Console Output with Emojis and Colors</h3>
    <pre><code>2024-04-27 12:34:56 ❌ [ERROR]: [authModule] Failed to authenticate user @john_doe.
2024-04-27 12:35:00 ⚠️ [WARN]: [botModule] User @jane_doe is using an outdated method.
2024-04-27 12:35:05 ℹ️ [INFO]: [botModule] Bot successfully launched.
2024-04-27 12:35:10 🔍 [VERBOSE]: [botModule] Received update: { ... }
2024-04-27 12:35:15 🐞 [DEBUG]: [botModule] Message from @john_doe: Hello!
2024-04-27 12:35:20 🎉 [SILLY]: [botModule] User @jane_doe invoked /silly command.
</code></pre>
    
    <h3>Combined Log File (<code>combined.log</code>)</h3>
    <pre><code>2024-04-27 12:34:56 [ERROR]: [authModule] Failed to authenticate user @john_doe.
2024-04-27 12:35:00 [WARN]: [botModule] User @jane_doe is using an outdated method.
2024-04-27 12:35:05 [INFO]: [botModule] Bot successfully launched.
2024-04-27 12:35:10 [VERBOSE]: [botModule] Received update: { ... }
2024-04-27 12:35:15 [DEBUG]: [botModule] Message from @john_doe: Hello!
2024-04-27 12:35:20 [SILLY]: [botModule] User @jane_doe invoked /silly command.
</code></pre>
    
    <h2>📈 Statistics</h2>
    <div class="badges">
      <img src="https://img.shields.io/npm/dt/telegraf-logger.svg" alt="npm downloads">
      <img src="https://img.shields.io/github/issues/shadowmurphy/telegraf-logger.svg" alt="GitHub issues">
      <img src="https://img.shields.io/github/issues-pr/shadowmurphy/telegraf-logger.svg" alt="GitHub pull requests">
    </div>
    
    <h2>📢 Updates</h2>
    <p>Stay updated with the latest changes in the <a href="https://github.com/shadowmurphy/telegraf-logger" target="_blank">GitHub repository</a>.</p>
    
    <div class="footer">
      <hr>
      <p>Thank you for using <strong>Telegraf Logger</strong>! If you find this package useful, please consider giving it a ⭐ on <a href="https://github.com/shadowmurphy/telegraf-logger" target="_blank">GitHub</a> and sharing it with other developers.</p>
    </div>
  </div>
</body>
</html>
