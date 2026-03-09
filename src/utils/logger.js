const winston = require('winston');
const path = require('path');
const fs = require('fs');
const { format } = require('date-fns');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Add colors to winston
winston.addColors(colors);

// Custom format for console
const consoleFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.colorize({ all: true }),
  format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Custom format for files
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.uncolorize(),
  format.json()
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.LOG_LEVEL || 'info'
  }),

  // File transport for all logs
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    tailable: true
  }),

  // File transport for errors only
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    tailable: true
  })
];

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  transports,
  exitOnError: false
});

// Stream for Morgan
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Logger class with additional methods
class Logger {
  constructor(context) {
    this.context = context;
  }

  // Create child logger with context
  child(context) {
    return new Logger(context);
  }

  // Format message with context
  formatMessage(level, message, meta = {}) {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const contextStr = this.context ? `[${this.context}] ` : '';
    
    return {
      timestamp,
      level,
      context: this.context,
      message: `${contextStr}${message}`,
      ...meta,
      ...(Object.keys(meta).length > 0 && { meta })
    };
  }

  // Log error
  error(message, meta = {}) {
    const logData = this.formatMessage('error', message, meta);
    logger.error(logData);
  }

  // Log warning
  warn(message, meta = {}) {
    const logData = this.formatMessage('warn', message, meta);
    logger.warn(logData);
  }

  // Log info
  info(message, meta = {}) {
    const logData = this.formatMessage('info', message, meta);
    logger.info(logData);
  }

  // Log http
  http(message, meta = {}) {
    const logData = this.formatMessage('http', message, meta);
    logger.http(logData);
  }

  // Log debug
  debug(message, meta = {}) {
    const logData = this.formatMessage('debug', message, meta);
    logger.debug(logData);
  }

  // Log with custom level
  log(level, message, meta = {}) {
    if (logger.levels[level]) {
      const logData = this.formatMessage(level, message, meta);
      logger.log(level, logData);
    } else {
      this.error(`Invalid log level: ${level}`);
    }
  }

  // Log request
  logRequest(req, res, responseTime) {
    const meta = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      responseTime,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      userId: req.user?._id
    };

    const message = `${meta.method} ${meta.url} ${meta.status} ${meta.responseTime}ms`;
    
    if (res.statusCode >= 500) {
      this.error(message, meta);
    } else if (res.statusCode >= 400) {
      this.warn(message, meta);
    } else {
      this.http(message, meta);
    }
  }

  // Log database query
  logQuery(query, duration) {
    this.debug('Database query', {
      query: query.getQuery(),
      collection: query.model?.collection.name,
      duration,
      options: query.getOptions()
    });
  }

  // Log API call
  logAPICall(service, method, url, duration, status) {
    const meta = {
      service,
      method,
      url,
      duration,
      status
    };

    const message = `API call to ${service}: ${method} ${url} (${status}) - ${duration}ms`;
    
    if (status >= 400) {
      this.error(message, meta);
    } else {
      this.info(message, meta);
    }
  }

  // Log performance
  logPerformance(operation, duration, meta = {}) {
    this.info(`Performance: ${operation}`, {
      operation,
      duration,
      ...meta
    });

    // Alert if slow
    if (duration > 1000) {
      this.warn(`Slow operation detected: ${operation} took ${duration}ms`, meta);
    }
  }

  // Log security event
  logSecurity(event, userId, ip, meta = {}) {
    this.warn(`Security: ${event}`, {
      event,
      userId,
      ip,
      ...meta,
      timestamp: new Date()
    });
  }

  // Log business event
  logEvent(event, data = {}) {
    this.info(`Event: ${event}`, {
      event,
      ...data,
      timestamp: new Date()
    });
  }

  // Start performance timer
  startTimer() {
    const start = process.hrtime();
    return () => {
      const [seconds, nanoseconds] = process.hrtime(start);
      return Math.round(seconds * 1000 + nanoseconds / 1000000);
    };
  }

  // Get logs
  async getLogs(options = {}) {
    const {
      level,
      from,
      to,
      limit = 100,
      offset = 0
    } = options;

    try {
      const logFile = path.join(logsDir, 'combined.log');
      const logs = fs.readFileSync(logFile, 'utf8')
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line))
        .filter(log => {
          if (level && log.level !== level) return false;
          if (from && new Date(log.timestamp) < new Date(from)) return false;
          if (to && new Date(log.timestamp) > new Date(to)) return false;
          return true;
        })
        .reverse()
        .slice(offset, offset + limit);

      return logs;

    } catch (error) {
      this.error('Error reading logs:', error);
      return [];
    }
  }

  // Clear old logs
  async clearOldLogs(days = 30) {
    try {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const files = fs.readdirSync(logsDir);

      for (const file of files) {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);

        if (stats.mtimeMs < cutoff) {
          fs.unlinkSync(filePath);
          this.info(`Deleted old log file: ${file}`);
        }
      }

    } catch (error) {
      this.error('Error clearing old logs:', error);
    }
  }
}

// Create default logger instance
const defaultLogger = new Logger('app');

// Export logger functions
module.exports = {
  logger: defaultLogger,
  Logger,
  
  // Export winston instance for advanced usage
  winston: logger,

  // Export log levels
  levels,

  // Helper functions
  createLogger: (context) => new Logger(context)
};