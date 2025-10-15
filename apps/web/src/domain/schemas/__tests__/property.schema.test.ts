import { MockPropertySchema, MockPropertyListSchema } from '../property.schema';

describe('Property Schema Contract Tests', () => {
  describe('MockPropertySchema', () => {
    it('should validate a complete property object', () => {
      const validProperty = {
        id: 'prop-001',
        idOwner: 'owner-001',
        name: 'Modern Luxury Villa',
        address: '1247 Sunset Boulevard',
        city: 'Los Angeles',
        price: 2800000,
        image: 'https://example.com/image.jpg',
        bedrooms: 5,
        bathrooms: 4,
        area: 84,
        areaUnit: 'm²' as const,
        propertyType: 'Villa' as const,
      };

      const result = MockPropertySchema.safeParse(validProperty);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchSnapshot();
      }
    });

    it('should validate a minimal property object (without optional fields)', () => {
      const minimalProperty = {
        id: 'prop-002',
        idOwner: 'owner-002',
        name: 'Downtown Apartment',
        address: '456 Park Avenue',
        city: 'New York',
        price: 1200000,
        image: 'https://example.com/apartment.jpg',
      };

      const result = MockPropertySchema.safeParse(minimalProperty);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchSnapshot();
      }
    });

    it('should reject property without required fields', () => {
      const invalidProperty = {
        id: 'prop-003',
        name: 'Incomplete Property',
        // Missing: idOwner, address, city, price, image
      };

      const result = MockPropertySchema.safeParse(invalidProperty);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.length).toBeGreaterThan(0);
      }
    });

    it('should reject property with invalid price (negative)', () => {
      const invalidProperty = {
        id: 'prop-004',
        idOwner: 'owner-004',
        name: 'Invalid Price Property',
        address: '789 Main St',
        city: 'Boston',
        price: -100000,
        image: 'https://example.com/image.jpg',
      };

      const result = MockPropertySchema.safeParse(invalidProperty);
      expect(result.success).toBe(false);
    });

    it('should validate property with all optional fields', () => {
      const propertyWithOptionals = {
        id: 'prop-005',
        idOwner: 'owner-005',
        name: 'Complete Property',
        address: '123 Complete St',
        city: 'Chicago',
        price: 500000,
        image: 'https://example.com/complete.jpg',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        areaUnit: 'sqft' as const,
        propertyType: 'Apartment' as const,
      };

      const result = MockPropertySchema.safeParse(propertyWithOptionals);
      expect(result.success).toBe(true);
    });

    it('should reject invalid areaUnit enum value', () => {
      const invalidProperty = {
        id: 'prop-006',
        idOwner: 'owner-006',
        name: 'Invalid Area Unit',
        address: '456 Test Ave',
        city: 'Seattle',
        price: 750000,
        image: 'https://example.com/test.jpg',
        areaUnit: 'acres', // Invalid enum value
      };

      const result = MockPropertySchema.safeParse(invalidProperty);
      expect(result.success).toBe(false);
    });

    it('should reject invalid propertyType enum value', () => {
      const invalidProperty = {
        id: 'prop-007',
        idOwner: 'owner-007',
        name: 'Invalid Property Type',
        address: '789 Test Blvd',
        city: 'Portland',
        price: 600000,
        image: 'https://example.com/test2.jpg',
        propertyType: 'Castle', // Invalid enum value
      };

      const result = MockPropertySchema.safeParse(invalidProperty);
      expect(result.success).toBe(false);
    });
  });

  describe('MockPropertyListSchema', () => {
    it('should validate an array of properties', () => {
      const propertyList = [
        {
          id: 'prop-001',
          idOwner: 'owner-001',
          name: 'Property 1',
          address: '123 Main St',
          city: 'City1',
          price: 500000,
          image: 'https://example.com/1.jpg',
        },
        {
          id: 'prop-002',
          idOwner: 'owner-002',
          name: 'Property 2',
          address: '456 Oak Ave',
          city: 'City2',
          price: 750000,
          image: 'https://example.com/2.jpg',
          bedrooms: 3,
          bathrooms: 2,
          area: 150,
          areaUnit: 'm²' as const,
          propertyType: 'House' as const,
        },
      ];

      const result = MockPropertyListSchema.safeParse(propertyList);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchSnapshot();
      }
    });

    it('should validate an empty array', () => {
      const emptyList: unknown[] = [];
      
      const result = MockPropertyListSchema.safeParse(emptyList);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([]);
      }
    });

    it('should reject array with invalid property', () => {
      const invalidList = [
        {
          id: 'prop-001',
          idOwner: 'owner-001',
          name: 'Valid Property',
          address: '123 Main St',
          city: 'City1',
          price: 500000,
          image: 'https://example.com/1.jpg',
        },
        {
          id: 'prop-002',
          // Missing required fields
          name: 'Invalid Property',
        },
      ];

      const result = MockPropertyListSchema.safeParse(invalidList);
      expect(result.success).toBe(false);
    });
  });

  describe('Contract Snapshots', () => {
    it('should match property contract snapshot', () => {
      const property = {
        id: 'snap-001',
        idOwner: 'owner-snap-001',
        name: 'Snapshot Test Property',
        address: '999 Snapshot Lane',
        city: 'Snapshot City',
        price: 999999,
        image: 'https://example.com/snapshot.jpg',
        bedrooms: 4,
        bathrooms: 3,
        area: 200,
        areaUnit: 'm²' as const,
        propertyType: 'Villa' as const,
      };

      const result = MockPropertySchema.parse(property);
      expect(result).toMatchSnapshot();
    });

    it('should match property list contract snapshot', () => {
      const properties = [
        {
          id: 'snap-list-001',
          idOwner: 'owner-snap-001',
          name: 'List Property 1',
          address: '100 List Ave',
          city: 'List City',
          price: 100000,
          image: 'https://example.com/list1.jpg',
        },
        {
          id: 'snap-list-002',
          idOwner: 'owner-snap-002',
          name: 'List Property 2',
          address: '200 List Ave',
          city: 'List City',
          price: 200000,
          image: 'https://example.com/list2.jpg',
          bedrooms: 2,
          bathrooms: 1,
        },
      ];

      const result = MockPropertyListSchema.parse(properties);
      expect(result).toMatchSnapshot();
    });
  });
});
