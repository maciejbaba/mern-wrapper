// MongoDB initialization script
// This script runs automatically when the MongoDB container starts for the first time

print("🌱 Initializing ecommerce database...");

// Switch to the ecommerce database
db = db.getSiblingDB('ecommerce');

// Create collections (they will be empty initially)
db.createCollection('users');
db.createCollection('items');

// Create indexes for better performance
db.users.createIndex({ "username": 1 }, { unique: true });
db.items.createIndex({ "name": 1 });

print("📊 Created database collections and indexes");
print("🎉 Database structure initialized!");
print("Note: Data will be seeded by the API service on startup");