import { MockPropertySchema, MockPropertyListSchema, PropertySchema } from '../property.schema';

describe('Property Schema Validation', () => {
  describe('MockPropertySchema', () => {
    it('should validate a valid mock property', () => {
      const validProperty = {
        id: 'prop-001',
        idOwner: 'owner-001',
        name: 'Test Property',
        address: '123 Test Street, Test City, TC 12345',
        price: 500000,
        image: 'https://example.com/image.jpg',
      };

      const result = MockPropertySchema.safeParse(validProperty);
      expect(result.success).toBe(true);
    });

    it('should reject invalid mock property data', () => {
      const invalidProperty = {
        id: 'prop-001',
        idOwner: 'owner-001',
        name: '', // Empty name should fail
        address: '123 Test Street',
        price: -1000, // Negative price should fail
        image: 'not-a-url', // Invalid URL should fail
      };

      const result = MockPropertySchema.safeParse(invalidProperty);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(3); // name, price, image errors
      }
    });

    it('should validate required fields', () => {
      const incompleteProperty = {
        id: 'prop-001',
        // Missing required fields
        price: 500000,
      };

      const result = MockPropertySchema.safeParse(incompleteProperty);
      expect(result.success).toBe(false);
    });
  });

  describe('MockPropertyListSchema', () => {
    it('should validate an array of mock properties', () => {
      const validProperties = [
        {
          id: 'prop-001',
          idOwner: 'owner-001',
          name: 'Property 1',
          address: '123 Test Street',
          price: 500000,
          image: 'https://example.com/image1.jpg',
        },
        {
          id: 'prop-002',
          idOwner: 'owner-002',
          name: 'Property 2',
          address: '456 Test Avenue',
          price: 750000,
          image: 'https://example.com/image2.jpg',
        },
      ];

      const result = MockPropertyListSchema.safeParse(validProperties);
      expect(result.success).toBe(true);
    });

    it('should reject array with invalid properties', () => {
      const invalidProperties = [
        {
          id: 'prop-001',
          idOwner: 'owner-001',
          name: 'Property 1',
          address: '123 Test Street',
          price: 500000,
          image: 'https://example.com/image1.jpg',
        },
        {
          id: 'prop-002',
          // Missing required fields
          price: 750000,
        },
      ];

      const result = MockPropertyListSchema.safeParse(invalidProperties);
      expect(result.success).toBe(false);
    });
  });

  describe('PropertySchema', () => {
    it('should validate a complete property object', () => {
      const validProperty = {
        id: 'prop-001',
        title: 'Luxury Apartment',
        description: 'A beautiful luxury apartment in the city center',
        price: 850000,
        currency: 'USD',
        location: {
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          coordinates: {
            lat: 40.7128,
            lng: -74.0060,
          },
        },
        propertyType: 'apartment' as const,
        bedrooms: 2,
        bathrooms: 2,
        area: 120,
        areaUnit: 'm2' as const,
        features: ['pool', 'gym', 'parking'],
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        status: 'available' as const,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const result = PropertySchema.safeParse(validProperty);
      expect(result.success).toBe(true);
    });

    it('should validate property with minimal required fields', () => {
      const minimalProperty = {
        id: 'prop-001',
        title: 'Test Property',
        description: 'A test property description',
        price: 100000,
        currency: 'USD',
        location: {
          address: '123 Test Street',
          city: 'Test City',
          state: 'TC',
          country: 'Test Country',
        },
        propertyType: 'house' as const,
        area: 100,
        areaUnit: 'm2' as const,
        features: [],
        images: [],
        status: 'available' as const,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const result = PropertySchema.safeParse(minimalProperty);
      expect(result.success).toBe(true);
    });
  });
});
