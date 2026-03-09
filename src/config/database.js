const mongoose = require('mongoose');

// Database configuration
const dbConfig = {
  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/quickstore',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: process.env.NODE_ENV === 'development',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: process.env.NODE_ENV === 'production' ? 50 : 10,
      minPoolSize: process.env.NODE_ENV === 'production' ? 5 : 2,
      maxIdleTimeMS: 10000,
      retryWrites: true,
      retryReads: true,
      compressors: 'snappy,zlib',
      heartbeatFrequencyMS: 10000,
      connectTimeoutMS: 10000,
      keepAlive: true,
      keepAliveInitialDelay: 300000
    },
    // Connection events
    events: {
      connected: 'MongoDB connected successfully',
      error: 'MongoDB connection error',
      disconnected: 'MongoDB disconnected',
      reconnected: 'MongoDB reconnected',
      close: 'MongoDB connection closed'
    }
  },

  // Redis configuration
  redis: {
    uri: process.env.REDIS_URI || 'redis://localhost:6379',
    options: {
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            return new Error('Redis max retries reached');
          }
          return Math.min(retries * 100, 3000);
        },
        connectTimeout: 10000,
        keepAlive: 30000
      },
      password: process.env.REDIS_PASSWORD || null,
      database: parseInt(process.env.REDIS_DB) || 0,
      commandsQueueMaxLength: 5000,
      disableOfflineQueue: false
    },
    keyPrefix: 'quickstore:',
    ttl: {
      default: 3600, // 1 hour
      session: 86400, // 24 hours
      cache: 300, // 5 minutes
      temp: 60 // 1 minute
    }
  },

  // Connection status
  status: {
    disconnected: 0,
    connected: 1,
    connecting: 2,
    disconnecting: 3
  },

  // Database names
  databases: {
    main: 'quickstore',
    test: 'quickstore_test',
    analytics: 'quickstore_analytics',
    logs: 'quickstore_logs'
  },

  // Collection names
  collections: {
    users: 'users',
    stores: 'stores',
    products: 'products',
    orders: 'orders',
    categories: 'categories',
    variants: 'variants',
    affiliates: 'affiliates',
    commissions: 'commissions',
    subscriptions: 'subscriptions',
    payments: 'payments',
    themes: 'themes',
    analytics: 'analytics',
    sessions: 'sessions',
    logs: 'logs',
    migrations: 'migrations'
  },

  // Index configuration
  indexes: {
    users: [
      { fields: { email: 1 }, options: { unique: true } },
      { fields: { role: 1 } },
      { fields: { status: 1 } },
      { fields: { createdAt: -1 } }
    ],
    stores: [
      { fields: { url: 1 }, options: { unique: true } },
      { fields: { owner: 1 } },
      { fields: { status: 1 } },
      { fields: { plan: 1 } },
      { fields: { createdAt: -1 } }
    ],
    products: [
      { fields: { store: 1 } },
      { fields: { sku: 1 }, options: { unique: true, sparse: true } },
      { fields: { category: 1 } },
      { fields: { status: 1 } },
      { fields: { 'ratings.average': -1 } },
      { fields: { 'sales.count': -1 } },
      { fields: { createdAt: -1 } },
      { fields: { name: 'text', description: 'text', tags: 'text' } }
    ],
    orders: [
      { fields: { store: 1 } },
      { fields: { orderNumber: 1 }, options: { unique: true } },
      { fields: { 'customer.email': 1 } },
      { fields: { status: 1 } },
      { fields: { paymentStatus: 1 } },
      { fields: { createdAt: -1 } }
    ]
  },

  // Query timeouts
  timeouts: {
    find: 30000,
    findOne: 15000,
    insert: 10000,
    update: 15000,
    delete: 10000,
    aggregate: 60000
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
    defaultPage: 1,
    sortOrders: ['asc', 'desc']
  },

  // Validation rules
  validation: {
    stringMaxLength: 1000,
    textMaxLength: 10000,
    arrayMaxSize: 100,
    numberMin: 0,
    numberMax: 999999999
  },

  // Backup configuration
  backup: {
    enabled: process.env.NODE_ENV === 'production',
    interval: '0 0 * * *', // Daily at midnight
    retention: 7, // Keep 7 days of backups
    path: process.env.BACKUP_PATH || './backups',
    compression: true,
    encrypt: true
  },

  // Migration configuration
  migrations: {
    path: './migrations',
    collection: 'migrations',
    autosync: process.env.NODE_ENV === 'development',
    template: `module.exports = {
  async up(db) {
    // Migration up
  },
  async down(db) {
    // Migration down
  }
};`
  },

  // Connection pool settings
  pool: {
    maxPoolSize: process.env.NODE_ENV === 'production' ? 100 : 20,
    minPoolSize: process.env.NODE_ENV === 'production' ? 10 : 2,
    maxIdleTimeMS: 30000,
    waitQueueTimeoutMS: 10000
  },

  // Monitoring
  monitoring: {
    slowQueryThreshold: 1000, // ms
    logQueries: process.env.NODE_ENV === 'development',
    trackStats: true,
    sampleRate: 0.1 // Log 10% of queries in production
  },

  // Replica set (if used)
  replicaSet: process.env.MONGODB_REPLICA_SET || null,

  // TLS/SSL
  ssl: {
    enabled: process.env.MONGODB_SSL === 'true',
    validate: process.env.MONGODB_SSL_VALIDATE === 'true',
    ca: process.env.MONGODB_SSL_CA,
    key: process.env.MONGODB_SSL_KEY,
    cert: process.env.MONGODB_SSL_CERT
  },

  // Authentication
  auth: {
    source: process.env.MONGODB_AUTH_SOURCE || 'admin',
    mechanism: process.env.MONGODB_AUTH_MECHANISM || 'DEFAULT',
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD
  },

  // Get connection string with auth
  getConnectionString() {
    let uri = this.mongo.uri;

    if (this.auth.user && this.auth.password) {
      const parsed = new URL(uri);
      parsed.username = this.auth.user;
      parsed.password = this.auth.password;
      uri = parsed.toString();
    }

    if (this.replicaSet) {
      uri += `?replicaSet=${this.replicaSet}`;
    }

    if (this.ssl.enabled) {
      uri += `${uri.includes('?') ? '&' : '?'}ssl=true&sslValidate=${this.ssl.validate}`;
    }

    return uri;
  },

  // Get mongoose connection options
  getMongooseOptions() {
    return {
      ...this.mongo.options,
      auth: this.auth.user && this.auth.password ? {
        username: this.auth.user,
        password: this.auth.password
      } : undefined,
      ssl: this.ssl.enabled,
      sslValidate: this.ssl.validate,
      sslCA: this.ssl.ca,
      sslKey: this.ssl.key,
      sslCert: this.ssl.cert,
      replicaSet: this.replicaSet
    };
  },

  // Get Redis configuration
  getRedisConfig() {
    return {
      url: this.redis.uri,
      ...this.redis.options,
      keyPrefix: this.redis.keyPrefix
    };
  },

  // Check if collection exists
  async collectionExists(db, collectionName) {
    const collections = await db.listCollections({ name: collectionName }).toArray();
    return collections.length > 0;
  },

  // Get collection stats
  async getCollectionStats(db, collectionName) {
    const stats = await db.command({ collStats: collectionName });
    return {
      name: stats.ns,
      count: stats.count,
      size: stats.size,
      avgObjSize: stats.avgObjSize,
      storageSize: stats.storageSize,
      indexes: stats.nindexes,
      indexSize: stats.totalIndexSize,
      totalSize: stats.size + stats.totalIndexSize
    };
  },

  // Create indexes for collection
  async createIndexes(model, indexes) {
    for (const index of indexes) {
      try {
        await model.collection.createIndex(index.fields, index.options);
        console.log(`Created index on ${model.collection.name}:`, index.fields);
      } catch (error) {
        console.error(`Error creating index:`, error);
      }
    }
  },

  // Drop all indexes (use with caution)
  async dropAllIndexes(model) {
    try {
      await model.collection.dropIndexes();
      console.log(`Dropped all indexes from ${model.collection.name}`);
    } catch (error) {
      console.error(`Error dropping indexes:`, error);
    }
  },

  // Ensure indexes are created
  async ensureIndexes() {
    const User = require('../models/User');
    const Store = require('../models/Store');
    const Product = require('../models/Product');
    const Order = require('../models/Order');

    await this.createIndexes(User, this.indexes.users);
    await this.createIndexes(Store, this.indexes.stores);
    await this.createIndexes(Product, this.indexes.products);
    await this.createIndexes(Order, this.indexes.orders);
  },

  // Get database size
  async getDatabaseSize(db) {
    const stats = await db.stats();
    return {
      database: stats.db,
      collections: stats.collections,
      objects: stats.objects,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
      totalSize: stats.dataSize + stats.indexSize
    };
  },

  // Compact database
  async compactDatabase(db) {
    try {
      await db.command({ compact: 'stores' });
      await db.command({ compact: 'products' });
      await db.command({ compact: 'orders' });
      console.log('Database compacted successfully');
    } catch (error) {
      console.error('Error compacting database:', error);
    }
  },

  // Repair database
  async repairDatabase(db) {
    try {
      await db.command({ repairDatabase: 1 });
      console.log('Database repaired successfully');
    } catch (error) {
      console.error('Error repairing database:', error);
    }
  }
};

module.exports = dbConfig;