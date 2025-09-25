// This file runs Node.js code to properly seed the database
// It will be executed by a separate container after MongoDB is ready

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  const uri = 'mongodb://admin:password123@mongodb:27017/ecommerce?authSource=admin';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('🌱 Connected to MongoDB for seeding...');

    const db = client.db('ecommerce');

    // Clear existing collections
    try {
      await db.collection('users').drop();
    } catch (e) {
      // Collection might not exist
    }
    try {
      await db.collection('items').drop();
    } catch (e) {
      // Collection might not exist
    }

    console.log('🧹 Cleared existing data');

    // Hash passwords
    const saltRounds = 12;
    const adminPassword = await bcrypt.hash('admin', saltRounds);
    const userPassword = await bcrypt.hash('user', saltRounds);

    // Insert users with hashed passwords
    await db.collection('users').insertMany([
      {
        username: 'admin',
        password: adminPassword,
        isAdmin: true,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user',
        password: userPassword,
        isAdmin: false,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('👤 Created users with hashed passwords');

    // Insert items
    await db.collection('items').insertMany([
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        price: 149.99,
        photoURL: "/headphones.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Smart Fitness Tracker",
        description: "Advanced fitness tracker with heart rate monitoring, GPS, and smartphone notifications.",
        price: 79.99,
        photoURL: "/fitness-tracker.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Organic Coffee Beans",
        description: "100% organic, fair-trade coffee beans from sustainable farms. Medium roast with rich flavor.",
        price: 24.99,
        photoURL: "/coffee-beans.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Ergonomic Office Chair",
        description: "Comfortable office chair with lumbar support and adjustable height.",
        price: 299.99,
        photoURL: "/office-chair.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Portable Power Bank 20000mAh",
        description: "High-capacity portable charger with fast charging technology.",
        price: 34.99,
        photoURL: "/power-bank.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('🛍️ Created sample items');

    // Create indexes
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('items').createIndex({ name: 1 });

    console.log('📊 Created indexes');
    console.log('🎉 Database seeding completed!');
    console.log('');
    console.log('Default accounts:');
    console.log('👑 Admin: username=admin, password=admin');
    console.log('👤 User: username=user, password=user');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seedDatabase();