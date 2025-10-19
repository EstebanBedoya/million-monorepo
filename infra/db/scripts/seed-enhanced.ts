import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@mongodb:27017/million_properties?authSource=admin';
const DATABASE_NAME = 'million_properties';

interface MockProperty {
  id: string;
  idOwner: string;
  name: string;
  address: string;
  city: string;
  price: number;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  propertyType?: string;
}

interface Owner {
  idOwner: string;
  name: string;
  address: string;
  photo: string;
  birthday: string;
}

interface PropertyImage {
  idPropertyImage: string;
  idProperty: string;
  file: string;
  enabled: boolean;
}

interface PropertyTrace {
  idPropertyTrace: string;
  idProperty: string;
  dateSale: string;
  name: string;
  value: number;
  tax: number;
}

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🚀 Starting enhanced database seeding...');
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully');

    const db = client.db(DATABASE_NAME);

    const ownersPath = path.join(__dirname, '../seed/owners.json');
    const propertiesPath = path.join(__dirname, '../seed/properties.json');
    const imagesPath = path.join(__dirname, '../seed/property-images.json');
    const tracesPath = path.join(__dirname, '../seed/property-traces.json');

    console.log('📁 Reading mock data files...');
    const owners: Owner[] = JSON.parse(fs.readFileSync(ownersPath, 'utf-8'));
    const mockProperties: MockProperty[] = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
    const images: PropertyImage[] = JSON.parse(fs.readFileSync(imagesPath, 'utf-8'));
    const traces: PropertyTrace[] = JSON.parse(fs.readFileSync(tracesPath, 'utf-8'));

    console.log('🗑️ Dropping existing collections...');
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`   Dropped collection: ${collection.name}`);
    }

    console.log('\n👥 Seeding owners collection...');
    const ownersCollection = db.collection('owners');
    const ownersToInsert = owners.map(owner => ({
      _id: owner.idOwner,
      idOwner: owner.idOwner,
      name: owner.name,
      address: owner.address,
      photo: owner.photo,
      birthday: new Date(owner.birthday)
    }));
    await ownersCollection.insertMany(ownersToInsert);
    console.log(`✅ Inserted ${ownersToInsert.length} owners`);

    console.log('\n🏠 Seeding properties collection...');
    const propertiesCollection = db.collection('properties');
    const propertiesToInsert = mockProperties.map((prop, index) => ({
      _id: prop.id,
      idProperty: prop.id,
      name: prop.name,
      address: `${prop.address}, ${prop.city}`,
      price: prop.price,
      codeInternal: `PROP-${String(index + 1).padStart(4, '0')}`,
      year: 2020 + (index % 5),
      idOwner: prop.idOwner
    }));
    await propertiesCollection.insertMany(propertiesToInsert);
    console.log(`✅ Inserted ${propertiesToInsert.length} properties`);

    console.log('\n🖼️ Seeding property_images collection...');
    const imagesCollection = db.collection('property_images');
    const imagesToInsert = images.map(img => ({
      _id: img.idPropertyImage,
      idPropertyImage: img.idPropertyImage,
      idProperty: img.idProperty,
      file: img.file,
      enabled: img.enabled
    }));
    await imagesCollection.insertMany(imagesToInsert);
    console.log(`✅ Inserted ${imagesToInsert.length} property images`);

    console.log('\n📊 Seeding property_traces collection...');
    const tracesCollection = db.collection('property_traces');
    const tracesToInsert = traces.map(trace => ({
      _id: trace.idPropertyTrace,
      idPropertyTrace: trace.idPropertyTrace,
      idProperty: trace.idProperty,
      dateSale: new Date(trace.dateSale),
      name: trace.name,
      value: trace.value,
      tax: trace.tax
    }));
    await tracesCollection.insertMany(tracesToInsert);
    console.log(`✅ Inserted ${tracesToInsert.length} property traces`);

    console.log('\n🔍 Creating indexes for better performance...');
    
    // Owners indexes
    await ownersCollection.createIndex({ name: 'text', address: 'text' });
    await ownersCollection.createIndex({ birthday: 1 });
    console.log('   ✅ Owners indexes created');

    // Properties indexes
    await propertiesCollection.createIndex({ name: 'text', address: 'text' });
    await propertiesCollection.createIndex({ price: 1 });
    await propertiesCollection.createIndex({ idOwner: 1 });
    await propertiesCollection.createIndex({ year: 1 });
    await propertiesCollection.createIndex({ codeInternal: 1 });
    console.log('   ✅ Properties indexes created');

    // Property Images indexes
    await imagesCollection.createIndex({ idProperty: 1 });
    await imagesCollection.createIndex({ enabled: 1 });
    console.log('   ✅ Property Images indexes created');

    // Property Traces indexes
    await tracesCollection.createIndex({ idProperty: 1 });
    await tracesCollection.createIndex({ dateSale: -1 });
    await tracesCollection.createIndex({ value: 1 });
    console.log('   ✅ Property Traces indexes created');

    console.log('\n📈 Generating statistics...');
    
    // Calculate some statistics
    const totalProperties = await propertiesCollection.countDocuments();
    const totalOwners = await ownersCollection.countDocuments();
    const totalImages = await imagesCollection.countDocuments();
    const totalTraces = await tracesCollection.countDocuments();
    
    const avgPrice = await propertiesCollection.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]).toArray();
    
    const priceRange = await propertiesCollection.aggregate([
      { $group: { 
        _id: null, 
        minPrice: { $min: '$price' }, 
        maxPrice: { $max: '$price' } 
      } }
    ]).toArray();

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Owners: ${totalOwners}`);
    console.log(`   🏠 Properties: ${totalProperties}`);
    console.log(`   🖼️ Property Images: ${totalImages}`);
    console.log(`   📊 Property Traces: ${totalTraces}`);
    
    if (avgPrice.length > 0) {
      console.log(`   💰 Average Property Price: $${avgPrice[0].avgPrice.toLocaleString()}`);
    }
    
    if (priceRange.length > 0) {
      console.log(`   💵 Price Range: $${priceRange[0].minPrice.toLocaleString()} - $${priceRange[0].maxPrice.toLocaleString()}`);
    }

    console.log('\n🚀 Database is ready for use!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

seedDatabase();
