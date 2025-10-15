import { MongoClient } from 'mongodb';
import propertiesData from '../seed/properties.seed.json';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/million_properties?authSource=admin';
const DB_NAME = 'million_properties';
const COLLECTION_NAME = 'properties';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Clear existing data
    await collection.deleteMany({});
    console.log('Cleared existing properties');
    
    // Insert seed data
    const result = await collection.insertMany(propertiesData);
    console.log(`Inserted ${result.insertedCount} properties`);
    
    // Create indexes
    await collection.createIndex({ title: 'text', description: 'text' });
    await collection.createIndex({ 'location.city': 1 });
    await collection.createIndex({ price: 1 });
    await collection.createIndex({ propertyType: 1 });
    await collection.createIndex({ status: 1 });
    console.log('Created indexes');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
