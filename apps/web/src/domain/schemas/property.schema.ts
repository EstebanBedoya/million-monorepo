import { z } from 'zod';

// Base schemas for nested objects
const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const LocationSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  coordinates: CoordinatesSchema.optional(),
});

const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

// Property schema with validation
export const PropertySchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters (e.g., USD, EUR)'),
  location: LocationSchema,
  propertyType: z.enum(['apartment', 'house', 'commercial', 'land']),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  area: z.number().positive('Area must be positive'),
  areaUnit: z.enum(['m2', 'sqft']),
  features: z.array(z.string()),
  images: z.array(z.string().url('Images must be valid URLs')),
  status: z.enum(['available', 'sold', 'rented']),
  createdAt: z.string().datetime('Invalid date format'),
  updatedAt: z.string().datetime('Invalid date format'),
});

// Property list schema
export const PropertyListSchema = z.object({
  properties: z.array(PropertySchema),
  pagination: PaginationSchema,
});

// Simplified schema for mock data (matching the requirements)
export const MockPropertySchema = z.object({
  id: z.string(),
  idOwner: z.string(),
  name: z.string(),
  address: z.string(),
  price: z.number(),
  image: z.string(),
});

export const MockPropertyListSchema = z.array(MockPropertySchema);

// Type exports
export type PropertyType = z.infer<typeof PropertySchema>;
export type PropertyListType = z.infer<typeof PropertyListSchema>;
export type MockPropertyType = z.infer<typeof MockPropertySchema>;
export type MockPropertyListType = z.infer<typeof MockPropertyListSchema>;
export type PaginationType = z.infer<typeof PaginationSchema>;
export type LocationType = z.infer<typeof LocationSchema>;
export type CoordinatesType = z.infer<typeof CoordinatesSchema>;
