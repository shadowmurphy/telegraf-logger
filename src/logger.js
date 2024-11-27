// src/logger.js

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const WebSocket = require('ws');
const { getTimestamp, colorize } = require('./utils');
const { exec } = require('child_process');

/**
 * @typedef {Object} LoggerOptions
 * @property {string} [logDirectory]
 * @property {string} [logLevel]
 * @property {Object} [colors]
 * @property {Object} [prefixes]
 * @property {boolean} [useEmoji]
 * @property {number} [maxFileSize]
 * @property {Array<RegExp>} [maskPatterns]
 * @property {string} [moduleTag]
 * @property {boolean} [enableWebServer]
 * @property {number} [webServerPort]
 * @property {Array<Object>} [users]
 */

class Logger {
  /**
   * Creates a Logger instance
   * @param {LoggerOptions} [options]
   */
  constructor(options = {}) {
    this.logFormat = options.logFormat || 'text';
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
    this.maxFileSize = options.maxFileSize || 5 * 1024 * 1024;
    this.maskPatterns = options.maskPatterns || [];
    this.moduleTag = options.moduleTag || '';
    this.enableWebServer = options.enableWebServer || false;
    this.webServerPort = options.webServerPort || 3000;
    this.webClients = [];
    this.users = options.users || [];

    if (!fs.existsSync(this.logDirectory)) fs.mkdirSync(this.logDirectory, { recursive: true });

    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      verbose: 3,
      debug: 4,
      silly: 5,
    };

    this.currentLevel = this.levels[this.logLevel] !== undefined ? this.levels[this.logLevel] : 2;

    this.streams = {};

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

    this.jsonLogStream = fs.createWriteStream(
      path.join(this.logDirectory, 'logs.json'),
      { flags: 'a' }
    );

    if (this.enableWebServer) {
      this.killProcessOnPort(this.webServerPort)
        .then(() => this.startWebServer())
        .catch((err) => console.error(`Error freeing up port: ${err}`));
    }

    this.initializeUsers();
  }

  async initializeUsers() {
    try {
      const usersFileExists = fs.existsSync(path.join(this.logDirectory, 'users.json'));
      if (!usersFileExists) {
        await fs.promises.writeFile(
          path.join(this.logDirectory, 'users.json'),
          JSON.stringify([], null, 2)
        );
      }
      if (this.users.length > 0) {
        for (const user of this.users) {
          await this.createUser(user.username, user.password);
        }
      }
    } catch (err) {
      console.error('Error initializing users:', err);
    }
  }

  killProcessOnPort(port) {
    return new Promise((resolve, reject) => {
      const platform = process.platform;

      let command;

      if (platform === 'win32') {
        command = `netstat -ano | findstr :${port}`;
      } else {
        command = `lsof -t -i:${port}`;
      }

      exec(command, (err, stdout, stderr) => {
        if (err) {
          return resolve();
        }

        const pids = stdout.split('\n').filter(Boolean);

        if (pids.length === 0) {
          return resolve();
        }

        const killCommand = platform === 'win32'
          ? `taskkill /F /PID ${pids.join(' /PID ')}`
          : `kill -9 ${pids.join(' ')}`;

        exec(killCommand, (killErr, killStdout, killStderr) => {
          if (killErr) {
            return reject(killErr);
          }
          console.log(`Port ${port} has been freed.`);
          resolve();
        });
      });
    });
  }

  startWebServer() {
    const publicDir = path.join(__dirname, '..', 'public');
    const app = express();

    app.use(session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
    }));

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use('/styles', express.static(path.join(publicDir, 'styles')));
    app.use('/scripts', express.static(path.join(publicDir, 'scripts')));
    app.use('/pages', express.static(path.join(publicDir, 'pages')));

    app.use((req, res, next) => {
      if (req.session && req.session.authenticated) {
        next();
      } else if (['/login', '/authenticate'].includes(req.path)) {
        next();
      } else {
        res.redirect('/login');
      }
    });

    app.get('/login', (req, res) => {
      res.sendFile(path.join(publicDir, 'pages', 'login.html'));
    });

    app.post('/authenticate', async (req, res) => {
      const { username, password } = req.body;

      const validUser = await this.validateUser(username, password);

      if (validUser) {
        req.session.authenticated = true;
        req.session.username = username;
        res.redirect('/');
      } else {
        res.redirect('/login?error=Invalid credentials');
      }
    });

    app.get('/', (req, res) => {
      res.sendFile(path.join(publicDir, 'pages', 'logs.html'));
    });

    app.get('/analytics', (req, res) => {
      res.sendFile(path.join(publicDir, 'pages', 'analytics.html'));
    });

    app.get('/logs-data', (req, res) => {
      const logsFilePath = path.join(this.logDirectory, 'logs.json');
      fs.readFile(logsFilePath, 'utf8', (err, data) => {
        if (err && err.code === 'ENOENT') {
          // Файл не существует, отправляем пустой массив
          res.json({ success: true, logs: [] });
        } else if (err) {
          res.status(500).json({ success: false, error: 'Failed to read logs' });
        } else {
          const logs = data.trim().split('\n').map(line => {
            try {
              return JSON.parse(line);
            } catch (e) {
              return null;
            }
          }).filter(log => log !== null);
          res.json({ success: true, logs });
        }
      });
    });
    

    app.post('/set-log-level', (req, res) => {
      const { level } = req.body;
      this.setLogLevel(level);
      res.json({ success: true });
    });

    this.server = http.createServer(app);

    this.wss = new WebSocket.Server({ server: this.server });

    this.wss.on('connection', (ws) => {
      console.log('WebSocket client connected');

      ws.on('message', (message) => {
      });

      ws.on('close', () => {
        console.log('WebSocket client disconnected');
      });
    });

    this.server.listen(this.webServerPort, () => {
      console.log(`Logger web server started on port ${this.webServerPort}`);
    });
  }

  async validateUser(username, password) {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.username === username);
      if (user) {
        return await bcrypt.compare(password, user.passwordHash);
      }
      return false;
    } catch (err) {
      console.error('Error validating user:', err);
      return false;
    }
  }

  async createUser(username, password) {
    try {
      const users = await this.getUsers();
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        return false;
      }
      const passwordHash = await bcrypt.hash(password, 10);
      users.push({ username, passwordHash });
      await fs.promises.writeFile(
        path.join(this.logDirectory, 'users.json'),
        JSON.stringify(users, null, 2)
      );
      return true;
    } catch (err) {
      console.error('Error creating user:', err);
      return false;
    }
  }

  async getUsers() {
    try {
      const usersFilePath = path.join(this.logDirectory, 'users.json');
      if (!fs.existsSync(usersFilePath)) {
        await fs.promises.writeFile(usersFilePath, JSON.stringify([]));
      }
      const data = await fs.promises.readFile(usersFilePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading users file:', err);
      return [];
    }
  }

  stopWebServer() {
    if (this.server) {
      this.server.close();
      if (this.wss) {
        this.wss.close();
      }
    }
  }

  close() {
    Object.values(this.streams).forEach((stream) => {
      stream.end();
    });
    if (this.jsonLogStream) {
      this.jsonLogStream.end();
    }
    this.stopWebServer();
  }

  setLogFormat(format) {
    if (format === 'text' || format === 'json') this.logFormat = format;
  }

  applyMasking(message) {
    let maskedMessage = message;
    this.maskPatterns.forEach((pattern) => {
      maskedMessage = maskedMessage.replace(pattern, '[MASKED]');
    });
    return maskedMessage;
  }

  shouldLog(level) {
    return this.levels[level] <= this.currentLevel;
  }

  log(level, message) {
    if (this.shouldLog(level)) {
      const maskedMessage = this.applyMasking(message);
      const timestamp = new Date().toISOString();
      let prefix = this.prefixes[level] || `[${level.toUpperCase()}]`;

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

      const moduleInfo = this.moduleTag ? `[${this.moduleTag}] ` : '';
      const color = this.colors[level] || 'white';

      const logObject = {
        timestamp,
        level,
        module: this.moduleTag || '',
        message: maskedMessage,
        pid: process.pid,
      };

      const formattedMessage =
        this.logFormat === 'json'
          ? JSON.stringify(logObject)
          : `${timestamp} ${prefix}: ${moduleInfo}${maskedMessage}`;

      console.log(colorize(formattedMessage, color));
      this.writeToStream(level, formattedMessage);
      this.writeToStream('combined', formattedMessage);

      this.jsonLogStream.write(JSON.stringify(logObject) + '\n', (err) => {
        if (err) console.error('Error writing log to file:', err);
      });

      if (this.wss && this.wss.clients.size > 0) {
        const logData = JSON.stringify(logObject);
        this.wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(logData);
          }
        });
      }
    }
  }

  checkFileSizeAndRotate(streamName) {
    const filePath = path.join(this.logDirectory, `${streamName}.log`);
    fs.stat(filePath, (err, stats) => {
      if (!err && stats.size >= this.maxFileSize) {
        const timestamp = getTimestamp().replace(/[:\s]/g, '_');
        const newFilePath = path.join(this.logDirectory, `${streamName}-${timestamp}.log`);
        fs.rename(filePath, newFilePath, (err) => {
          if (!err) {
            this.streams[streamName].end();
            this.streams[streamName] = fs.createWriteStream(filePath, { flags: 'a' });
          }
        });
      }
    });
  }

  writeToStream(streamName, message) {
    this.checkFileSizeAndRotate(streamName);
    if (this.streams[streamName]) {
      this.streams[streamName].write(message + '\n');
    } else {
      const filePath = path.join(this.logDirectory, `${streamName}.log`);
      this.streams[streamName] = fs.createWriteStream(filePath, { flags: 'a' });
      this.streams[streamName].write(message + '\n');
    }
  }

  info(message) {
    this.log('info', message);
  }

  warn(message) {
    this.log('warn', message);
  }

  error(message) {
    this.log('error', message);
  }

  verbose(message) {
    this.log('verbose', message);
  }

  debug(message) {
    this.log('debug', message);
  }

  silly(message) {
    this.log('silly', message);
  }

  setColor(level, color) {
    if (this.colors[level]) {
      this.colors[level] = color;
    }
  }

  setPrefix(level, prefix) {
    if (this.prefixes[level]) {
      this.prefixes[level] = prefix;
    }
  }

  setLogLevel(level) {
    if (this.levels[level] !== undefined) {
      this.logLevel = level;
      this.currentLevel = this.levels[level];
      console.log(`Log level changed to ${level}`);
    }
  }

  setUseEmoji(useEmoji) {
    this.useEmoji = useEmoji;
  }

  setMaxFileSize(maxSize) {
    if (typeof maxSize === 'number' && maxSize > 0) {
      this.maxFileSize = maxSize;
    }
  }

  addMaskPattern(pattern) {
    if (pattern instanceof RegExp) {
      this.maskPatterns.push(pattern);
    }
  }

  setModuleTag(tag) {
    this.moduleTag = tag;
  }
}

module.exports = Logger;
