// test/logger.test.js

const Logger = require('../src/logger');
const http = require('http');
const EventSource = require('eventsource');

// Initialize the logger with various options
const logger = new Logger({
  logDirectory: 'test_logs',
  logLevel: 'debug',
  enableWebServer: true,
  webServerPort: 4000,
  useEmoji: true,
});

// Function to simulate logging at different levels
function simulateLogging() {
  logger.info('Info message');
  logger.warn('Warning message');
  logger.error('Error message');
  logger.debug('Debug message');
  logger.verbose('Verbose message');
  logger.silly('Silly message');
}

// Test logging to files
simulateLogging();

// Test the masking feature
logger.addMaskPattern(/SensitiveData/g);
logger.info('This contains SensitiveData that should be masked.');

// Test JSON logging format
logger.setLogFormat('json');
logger.info('This is a JSON formatted log message.');

// Test module tagging
logger.setModuleTag('TestModule');
logger.debug('This message has a module tag.');

// Test log rotation by setting max file size to a small value
logger.setMaxFileSize(1); // Set to 1 byte to force rotation
logger.info('This should trigger log rotation due to size limit.');

// Test the web server by connecting and receiving log updates
function testWebServer() {
  // Make an HTTP request to the root to get the HTML page
  http.get('http://localhost:4000/', (res) => {
    let htmlData = '';
    res.on('data', (chunk) => {
      htmlData += chunk;
    });
    res.on('end', () => {
      console.log('Received HTML page from web server.');
      // Optionally validate the HTML content
    });
  }).on('error', (err) => {
    console.error('Error fetching HTML page:', err.message);
  });

  // Connect to the SSE endpoint to receive logs
  const eventSource = new EventSource('http://localhost:4000/logs');

  eventSource.onmessage = (event) => {
    console.log('Received log via SSE:', event.data);
    // Close the connection after receiving a log
    eventSource.close();
    // Close the logger and web server
    logger.close();
    cleanUp();
  };

  eventSource.onerror = (err) => {
    console.error('Error with SSE connection:', err);
    eventSource.close();
    logger.close();
    cleanUp();
  };
}

// Start the web server test
testWebServer();

// Clean up test logs after tests are complete
function cleanUp() {
  const fs = require('fs');
  const path = require('path');
  const logDir = path.join(__dirname, '../test_logs');
  fs.rmSync(logDir, { recursive: true, force: true });
  console.log('Test logs cleaned up.');
}
