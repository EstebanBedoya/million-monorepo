import { GET } from '../route';
import { NextRequest } from 'next/server';

// Mock the properties data
jest.mock('../../../../../public/mock/properties.json', () => [
  {
    id: 'prop-001',
    idOwner: 'owner-001',
    name: 'Test Property 1',
    address: '123 Test Street, Test City, TC 12345',
    price: 500000,
    image: 'https://example.com/image1.jpg',
  },
  {
    id: 'prop-002',
    idOwner: 'owner-002',
    name: 'Modern Apartment',
    address: '456 Modern Avenue, Modern City, MC 54321',
    price: 750000,
    image: 'https://example.com/image2.jpg',
  },
  {
    id: 'prop-003',
    idOwner: 'owner-003',
    name: 'Luxury Villa',
    address: '789 Luxury Lane, Luxury City, LC 98765',
    price: 1200000,
    image: 'https://example.com/image3.jpg',
  },
]);

describe('/api/mock/properties', () => {
  it('should return properties with default pagination', async () => {
    const request = new NextRequest('http://localhost:3000/api/mock/properties');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('properties');
    expect(data).toHaveProperty('pagination');
    expect(Array.isArray(data.properties)).toBe(true);
    expect(data.pagination).toMatchObject({
      page: 1,
      limit: 10,
      total: 3,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });

  it('should return properties with custom pagination', async () => {
    const request = new NextRequest('http://localhost:3000/api/mock/properties?page=1&limit=2');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(2);
    expect(data.properties).toHaveLength(2);
  });

  it('should filter properties by search term', async () => {
    const request = new NextRequest('http://localhost:3000/api/mock/properties?search=Modern');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.properties).toHaveLength(1);
    expect(data.properties[0].name).toBe('Modern Apartment');
  });

  it('should filter properties by price range', async () => {
    const request = new NextRequest('http://localhost:3000/api/mock/properties?minPrice=600000&maxPrice=800000');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.properties).toHaveLength(1);
    expect(data.properties[0].price).toBe(750000);
  });

  it('should validate property structure', async () => {
    const request = new NextRequest('http://localhost:3000/api/mock/properties');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    
    if (data.properties.length > 0) {
      const property = data.properties[0];
      expect(property).toHaveProperty('id');
      expect(property).toHaveProperty('idOwner');
      expect(property).toHaveProperty('name');
      expect(property).toHaveProperty('address');
      expect(property).toHaveProperty('price');
      expect(property).toHaveProperty('image');
      
      expect(typeof property.id).toBe('string');
      expect(typeof property.idOwner).toBe('string');
      expect(typeof property.name).toBe('string');
      expect(typeof property.address).toBe('string');
      expect(typeof property.price).toBe('number');
      expect(typeof property.image).toBe('string');
    }
  });

  it('should handle multiple filters', async () => {
    const request = new NextRequest('http://localhost:3000/api/mock/properties?search=Luxury&minPrice=1000000');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.properties).toHaveLength(1);
    expect(data.properties[0].name).toBe('Luxury Villa');
  });
});
