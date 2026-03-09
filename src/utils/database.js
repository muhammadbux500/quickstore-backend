const mongoose = require('mongoose');
const redis = require('redis');
const { logger } = require('./logger');

class Database {
  constructor() {
    this.mongoConnection = null;
    this.redisClient = null;
  }

  // Connect to MongoDB
  async connectMongoDB() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: process.env.NODE_ENV === 'development',
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 10000,
        retryWrites: true,
        retryReads: true
      };

      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickstore';
      
      this.mongoConnection = await mongoose.connect(mongoURI, options);
      
      logger.info(`MongoDB connected: ${this.mongoConnection.connection.host}`);

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
      });

      return this.mongoConnection;

    } catch (error) {
      logger.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  // Connect to Redis
  async connectRedis() {
    try {
      const redisURI = process.env.REDIS_URI || 'redis://localhost:6379';
      
      this.redisClient = redis.createClient({
        url: redisURI,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              logger.error('Redis max retries reached');
              return new Error('Redis max retries reached');
            }
            return Math.min(retries * 100, 3000);
          }
        }
      });

      this.redisClient.on('error', (err) => {
        logger.error('Redis error:', err);
      });

      this.redisClient.on('connect', () => {
        logger.info('Redis connected');
      });

      this.redisClient.on('ready', () => {
        logger.info('Redis ready');
      });

      this.redisClient.on('end', () => {
        logger.warn('Redis connection ended');
      });

      await this.redisClient.connect();

      return this.redisClient;

    } catch (error) {
      logger.error('Redis connection error:', error);
      // Don't exit process, Redis is optional
      return null;
    }
  }

  // Disconnect from all databases
  async disconnectAll() {
    try {
      if (this.mongoConnection) {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected');
      }

      if (this.redisClient && this.redisClient.isOpen) {
        await this.redisClient.quit();
        logger.info('Redis disconnected');
      }

    } catch (error) {
      logger.error('Error disconnecting databases:', error);
    }
  }

  // Check database health
  async healthCheck() {
    const health = {
      mongodb: false,
      redis: false,
      timestamp: new Date()
    };

    // Check MongoDB
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.admin().ping();
        health.mongodb = true;
      }
    } catch (error) {
      logger.error('MongoDB health check failed:', error);
    }

    // Check Redis
    try {
      if (this.redisClient && this.redisClient.isOpen) {
        await this.redisClient.ping();
        health.redis = true;
      }
    } catch (error) {
      logger.error('Redis health check failed:', error);
    }

    return health;
  }

  // Get database stats
  async getStats() {
    try {
      const stats = {};

      // MongoDB stats
      if (mongoose.connection.readyState === 1) {
        const dbStats = await mongoose.connection.db.stats();
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        stats.mongodb = {
          database: mongoose.connection.db.databaseName,
          collections: collections.length,
          documents: dbStats.objects,
          dataSize: dbStats.dataSize,
          storageSize: dbStats.storageSize,
          indexes: dbStats.indexes,
          indexSize: dbStats.indexSize,
          avgObjSize: dbStats.avgObjSize
        };
      }

      // Redis stats
      if (this.redisClient && this.redisClient.isOpen) {
        const redisInfo = await this.redisClient.info();
        const parsedInfo = this.parseRedisInfo(redisInfo);
        
        stats.redis = {
          version: parsedInfo.redis_version,
          uptime: parsedInfo.uptime_in_seconds,
          connectedClients: parsedInfo.connected_clients,
          usedMemory: parsedInfo.used_memory_human,
          totalCommandsProcessed: parsedInfo.total_commands_processed,
          keyspaceHits: parsedInfo.keyspace_hits,
          keyspaceMisses: parsedInfo.keyspace_misses,
          hitRate: parsedInfo.keyspace_hits / (parsedInfo.keyspace_hits + parsedInfo.keyspace_misses) || 0
        };
      }

      return stats;

    } catch (error) {
      logger.error('Error getting database stats:', error);
      return null;
    }
  }

  // Parse Redis info
  parseRedisInfo(info) {
    const lines = info.split('\r\n');
    const parsed = {};

    lines.forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split(':');
        if (key && value) {
          parsed[key] = value;
        }
      }
    });

    return parsed;
  }

  // Create database backup
  async createBackup() {
    try {
      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB not connected');
      }

      const collections = await mongoose.connection.db.listCollections().toArray();
      const backup = {};

      for (const collection of collections) {
        const model = mongoose.model(collection.name);
        const documents = await model.find({}).lean();
        backup[collection.name] = documents;
      }

      backup._metadata = {
        timestamp: new Date(),
        version: process.env.npm_package_version,
        collections: collections.length
      };

      return backup;

    } catch (error) {
      logger.error('Error creating backup:', error);
      throw error;
    }
  }

  // Restore from backup
  async restoreBackup(backup) {
    try {
      if (mongoose.connection.readyState !== 1) {
        throw new Error('MongoDB not connected');
      }

      const { _metadata, ...collections } = backup;

      for (const [collectionName, documents] of Object.entries(collections)) {
        const model = mongoose.model(collectionName);
        
        // Clear existing data
        await model.deleteMany({});
        
        // Insert backup data
        if (documents.length > 0) {
          await model.insertMany(documents);
        }
      }

      logger.info(`Database restored from backup (${_metadata.timestamp})`);

    } catch (error) {
      logger.error('Error restoring backup:', error);
      throw error;
    }
  }

  // Run database migrations
  async runMigrations() {
    try {
      const Migration = mongoose.model('Migration');
      
      // Create migrations collection if it doesn't exist
      if (!mongoose.models.Migration) {
        const migrationSchema = new mongoose.Schema({
          name: String,
          appliedAt: { type: Date, default: Date.now }
        });
        mongoose.model('Migration', migrationSchema);
      }

      const appliedMigrations = await Migration.find().sort('name');
      const appliedNames = appliedMigrations.map(m => m.name);

      // Load migration files
      const migrations = require('fs').readdirSync('./migrations')
        .filter(file => file.endsWith('.js'))
        .sort();

      for (const file of migrations) {
        const migrationName = file.replace('.js', '');
        
        if (!appliedNames.includes(migrationName)) {
          logger.info(`Running migration: ${migrationName}`);
          
          const migration = require(`../migrations/${file}`);
          await migration.up(mongoose.connection);
          
          await Migration.create({ name: migrationName });
          
          logger.info(`Migration completed: ${migrationName}`);
        }
      }

    } catch (error) {
      logger.error('Error running migrations:', error);
      throw error;
    }
  }

  // Transaction helper
  async withTransaction(callback) {
    const session = await mongoose.startSession();
    
    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      return result;

    } catch (error) {
      await session.abortTransaction();
      throw error;

    } finally {
      session.endSession();
    }
  }

  // Get MongoDB connection
  getMongoConnection() {
    return this.mongoConnection;
  }

  // Get Redis client
  getRedisClient() {
    return this.redisClient;
  }

  // Check if MongoDB is connected
  isMongoConnected() {
    return mongoose.connection.readyState === 1;
  }

  // Check if Redis is connected
  isRedisConnected() {
    return this.redisClient && this.redisClient.isOpen;
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;