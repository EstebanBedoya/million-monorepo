import { GET } from '../route';
import { NextRequest } from 'next/server';

// Mock the properties data
jest.mock('../../../../../../public/mock/properties.json', () => [
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
]);

describe('/api/mock/properties/[id]', () => {
  it('should return a specific property by ID', async () => {
    const request = new NextRequest('http://localhost:3000/api/mock/properties/prop-001');
    const response = await GET(request, { params: { id: 'prop-001' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('prop-001');
    expect(data).toHaveProperty('idOwner');
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('address');
    expect(data).toHaveProperty('price');
    expect(data).toHaveProperty('image');
  });

  it('should return 404 for non-existent property', async () => {
    const request = new NextRequest('http://localhost:3000/api/mock/properties/nonexistent');
    const response = await GET(request, { params: { id: 'nonexistent' } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
    expect(data.error).toBe('Property not found');
  });

  it('should validate single property structure', async () => {
    const request = new NextRequest('http://localhost:3000/api/mock/properties/prop-001');
    const response = await GET(request, { params: { id: 'prop-001' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(typeof data.id).toBe('string');
    expect(typeof data.idOwner).toBe('string');
    expect(typeof data.name).toBe('string');
    expect(typeof data.address).toBe('string');
    expect(typeof data.price).toBe('number');
    expect(typeof data.image).toBe('string');
  });

  it('should return correct property data', async () => {
    const request = new NextRequest('http://localhost:3000/api/mock/properties/prop-002');
    const response = await GET(request, { params: { id: 'prop-002' } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe('prop-002');
    expect(data.name).toBe('Modern Apartment');
    expect(data.price).toBe(750000);
  });
});
