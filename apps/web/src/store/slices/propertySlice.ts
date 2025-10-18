import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Property, PropertyType, PropertyStatus, AreaUnit } from '../../domain/entities/Property';
import { PropertyService, CreatePropertyData } from '../../application/interfaces/PropertyService';
import { Container } from '../../infrastructure/di/Container';

// Serializable property interface for Redux state
export interface SerializableProperty {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  propertyType: PropertyType;
  area: number;
  areaUnit: AreaUnit;
  features: string[];
  images: Array<{
    idPropertyImage: string;
    idProperty: string;
    file: string;
    enabled: boolean;
  }> | string[];
  status: PropertyStatus;
  createdAt: string; // ISO string instead of Date
  updatedAt: string; // ISO string instead of Date
  bedrooms?: number;
  bathrooms?: number;
  year?: number;
  owner?: {
    idOwner: string;
    name: string;
    address: string;
    birthday: string;
    photo: string;
  };
  traces?: Array<{
    idPropertyTrace: string;
    dateSale: string;
    idProperty: string;
    name: string;
    tax: number;
    value: number;
  }>;
}

// Async thunks for property operations
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (options: { page?: number; limit?: number } = {}) => {
    const container = Container.getInstance();
    const propertyService = container.get<PropertyService>('PropertyService');
    const result = await propertyService.getAllProperties(options.page, options.limit);
    // Convert Property instances to serializable format
    return {
      data: result.data.map(propertyToSerializable),
      pagination: result.pagination
    };
  }
);

export const fetchAvailableProperties = createAsyncThunk(
  'properties/fetchAvailableProperties',
  async () => {
    const container = Container.getInstance();
    const propertyService = container.get<PropertyService>('PropertyService');
    const properties = await propertyService.getAvailableProperties();
    
    // Convert Property instances to serializable format
    return properties.map(propertyToSerializable);
  }
);

export const fetchExpensiveProperties = createAsyncThunk(
  'properties/fetchExpensiveProperties',
  async () => {
    const container = Container.getInstance();
    const propertyService = container.get<PropertyService>('PropertyService');
    const properties = await propertyService.getExpensiveProperties();
    
    // Convert Property instances to serializable format
    return properties.map(propertyToSerializable);
  }
);

export const fetchPropertyById = createAsyncThunk(
  'properties/fetchPropertyById',
  async (id: string) => {
    const container = Container.getInstance();
    const propertyService = container.get<PropertyService>('PropertyService');
    const property = await propertyService.getProperty(id);
    
    // Convert Property instance to serializable format
    return property ? propertyToSerializable(property) : null;
  }
);

export const createProperty = createAsyncThunk(
  'properties/createProperty',
  async (propertyData: CreatePropertyData) => {
    const container = Container.getInstance();
    const propertyService = container.get<PropertyService>('PropertyService');
    const property = await propertyService.createProperty(propertyData);
    
    // Convert Property instance to serializable format
    return propertyToSerializable(property);
  }
);

export const updateProperty = createAsyncThunk(
  'properties/updateProperty',
  async ({ id, data }: { id: string; data: Partial<CreatePropertyData> }) => {
    const container = Container.getInstance();
    const propertyService = container.get<PropertyService>('PropertyService');
    
    const existingProperty = await propertyService.getProperty(id);
    if (!existingProperty) {
      throw new Error('Property not found');
    }

    const propertyToUpdate = Property.create({
      id: existingProperty.id,
      name: data.name || existingProperty.name,
      description: data.description || existingProperty.description,
      price: data.price !== undefined ? data.price : existingProperty.price,
      currency: data.currency || existingProperty.currency,
      location: data.location || existingProperty.location,
      propertyType: data.propertyType || existingProperty.propertyType,
      area: data.area !== undefined ? data.area : existingProperty.area,
      areaUnit: data.areaUnit || existingProperty.areaUnit,
      features: data.features || existingProperty.features,
      images: data.images || existingProperty.images,
      status: data.status || existingProperty.status,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      createdAt: existingProperty.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const updated = await propertyService.updateProperty(propertyToUpdate);
    return propertyToSerializable(updated);
  }
);

export const deleteProperty = createAsyncThunk(
  'properties/deleteProperty',
  async (id: string) => {
    const container = Container.getInstance();
    const propertyService = container.get<PropertyService>('PropertyService');
    await propertyService.deleteProperty(id);
    return id;
  }
);

// Helper functions to convert between Property instances and serializable data
const propertyToSerializable = (property: Property): SerializableProperty => ({
  id: property.id,
  name: property.name,
  description: property.description,
  price: property.price,
  currency: property.currency,
  location: property.location,
  propertyType: property.propertyType,
  area: property.area,
  areaUnit: property.areaUnit,
  features: property.features,
  images: property.images as Array<{
    idPropertyImage: string;
    idProperty: string;
    file: string;
    enabled: boolean;
  }> | string[],
  status: property.status,
  createdAt: property.createdAt.toISOString(),
  updatedAt: property.updatedAt.toISOString(),
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  year: property.year,
  owner: property.owner,
  traces: property.traces,
});

const serializableToProperty = (data: SerializableProperty): Property => 
  Property.create({
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    currency: data.currency,
    location: data.location,
    propertyType: data.propertyType,
    area: data.area,
    areaUnit: data.areaUnit,
    features: data.features,
    images: data.images,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
  });

// Normalized state interface for efficient handling of 1000+ properties
interface PropertyState {
  // Normalized data structure - using serializable data
  byId: Record<string, SerializableProperty>;
  allIds: string[];
  filteredIds: string[]; // IDs after applying filters
  
  // UI state
  selectedProperty: SerializableProperty | null;
  loading: boolean;
  error: string | null;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  
  // Filters
  filter: 'all' | 'available' | 'expensive';
  searchFilters: {
    search: string;
    minPrice: number;
    maxPrice: number;
    propertyType: string;
  };
  
  // Cache management
  cache: {
    timestamp: number;
    ttl: number; // Time to live in milliseconds (5 minutes)
    filters: Record<string, unknown>;
    needsRefresh: boolean;
  };
}

// Initial state
const initialState: PropertyState = {
  // Normalized data
  byId: {},
  allIds: [],
  filteredIds: [],
  
  // UI state
  selectedProperty: null,
  loading: false,
  error: null,
  
  // Pagination
  pagination: null,
  
  // Filters
  filter: 'all',
  searchFilters: {
    search: '',
    minPrice: 0,
    maxPrice: 1000000000,
    propertyType: '',
  },
  
  // Cache
  cache: {
    timestamp: 0,
    ttl: 5 * 60 * 1000, // 5 minutes
    filters: {},
    needsRefresh: true,
  },
};

// Helper function to apply all filters
const applyFilters = (state: PropertyState) => {
  state.filteredIds = state.allIds.filter(id => {
    const propertyData = state.byId[id];
    if (!propertyData) return false;
    
    // Convert to Property instance for business logic
    const property = serializableToProperty(propertyData);
    
    // Apply basic filter (available/expensive)
    switch (state.filter) {
      case 'available':
        if (!property.isAvailable()) return false;
        break;
      case 'expensive':
        if (!property.isExpensive()) return false;
        break;
    }
    
    // Apply search filter
    if (state.searchFilters.search) {
      const searchTerm = state.searchFilters.search.toLowerCase();
      const matchesSearch = 
        property.name.toLowerCase().includes(searchTerm) ||
        property.description.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    // Apply price range filter
    if (property.price < state.searchFilters.minPrice || 
        property.price > state.searchFilters.maxPrice) {
      return false;
    }
    
    // Apply property type filter
    if (state.searchFilters.propertyType && 
        property.propertyType.toLowerCase() !== state.searchFilters.propertyType.toLowerCase()) {
      return false;
    }
    
    return true;
  });
};

// Property slice
const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload ? propertyToSerializable(action.payload) : null;
    },
    setFilter: (state, action: PayloadAction<'all' | 'available' | 'expensive'>) => {
      state.filter = action.payload;
      applyFilters(state);
    },
    setSearchFilters: (state, action: PayloadAction<Partial<PropertyState['searchFilters']>>) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload };
      applyFilters(state);
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSearchFilters: (state) => {
      state.searchFilters = {
        search: '',
        minPrice: 0,
        maxPrice: 1000000000,
        propertyType: '',
      };
      applyFilters(state);
    },
    clearProperties: (state) => {
      state.byId = {};
      state.allIds = [];
      state.filteredIds = [];
      state.pagination = null;
      state.cache.needsRefresh = true;
    },
    invalidateCache: (state) => {
      state.cache.needsRefresh = true;
      state.cache.timestamp = 0;
    },
    updateCache: (state, action: PayloadAction<{ filters: Record<string, unknown> }>) => {
      state.cache.timestamp = Date.now();
      state.cache.filters = action.payload.filters;
      state.cache.needsRefresh = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch properties
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        
        // Properties are already in serializable format from thunk
        const properties = action.payload.data;
        const newById: Record<string, SerializableProperty> = {};
        const newAllIds: string[] = [];
        
        properties.forEach(property => {
          newById[property.id] = property;
          newAllIds.push(property.id);
        });
        
        // Update normalized state
        state.byId = { ...state.byId, ...newById };
        state.allIds = [...new Set([...state.allIds, ...newAllIds])]; // Avoid duplicates
        
        // Apply all filters
        applyFilters(state);
        
        state.pagination = action.payload.pagination;
        state.error = null;
        
        // Update cache
        state.cache.timestamp = Date.now();
        state.cache.needsRefresh = false;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch properties';
      });

    // Fetch available properties
    builder
      .addCase(fetchAvailableProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableProperties.fulfilled, (state, action) => {
        state.loading = false;
        
        // Properties are already in serializable format from thunk
        const properties = action.payload;
        const newById: Record<string, SerializableProperty> = {};
        const newAllIds: string[] = [];
        
        properties.forEach(property => {
          newById[property.id] = property;
          newAllIds.push(property.id);
        });
        
        // Update normalized state
        state.byId = { ...state.byId, ...newById };
        state.allIds = [...new Set([...state.allIds, ...newAllIds])];
        state.filteredIds = newAllIds; // Available properties are already filtered
        
        state.error = null;
        state.cache.timestamp = Date.now();
        state.cache.needsRefresh = false;
      })
      .addCase(fetchAvailableProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch available properties';
      });

    // Fetch expensive properties
    builder
      .addCase(fetchExpensiveProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpensiveProperties.fulfilled, (state, action) => {
        state.loading = false;
        
        // Properties are already in serializable format from thunk
        const properties = action.payload;
        const newById: Record<string, SerializableProperty> = {};
        const newAllIds: string[] = [];
        
        properties.forEach(property => {
          newById[property.id] = property;
          newAllIds.push(property.id);
        });
        
        // Update normalized state
        state.byId = { ...state.byId, ...newById };
        state.allIds = [...new Set([...state.allIds, ...newAllIds])];
        state.filteredIds = newAllIds; // Expensive properties are already filtered
        
        state.error = null;
        state.cache.timestamp = Date.now();
        state.cache.needsRefresh = false;
      })
      .addCase(fetchExpensiveProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch expensive properties';
      });

    // Fetch property by ID
    builder
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProperty = action.payload;
        state.error = null;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch property';
      });

    // Create property
    builder
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;
        
        // Property is already in serializable format from thunk
        const newProperty = action.payload;
        state.byId[newProperty.id] = newProperty;
        
        // Add to allIds if not already present
        if (!state.allIds.includes(newProperty.id)) {
          state.allIds.unshift(newProperty.id); // Add to beginning
        }
        
        // Add to filteredIds if it matches current filter
        // Convert to Property instance for business logic
        const propertyInstance = serializableToProperty(newProperty);
        const shouldInclude = (() => {
          switch (state.filter) {
            case 'available':
              return propertyInstance.isAvailable();
            case 'expensive':
              return propertyInstance.isExpensive();
            default:
              return true;
          }
        })();
        
        if (shouldInclude && !state.filteredIds.includes(newProperty.id)) {
          state.filteredIds.unshift(newProperty.id);
        }
        
        state.error = null;
        state.cache.timestamp = Date.now();
        state.cache.needsRefresh = true; // New property added, cache needs refresh
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create property';
      });

    // Update property
    builder
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        
        const updatedProperty = action.payload;
        state.byId[updatedProperty.id] = updatedProperty;
        
        applyFilters(state);
        
        state.error = null;
        state.cache.timestamp = Date.now();
        state.cache.needsRefresh = true;
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update property';
      });

    // Delete property
    builder
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        
        const deletedId = action.payload;
        
        delete state.byId[deletedId];
        state.allIds = state.allIds.filter(id => id !== deletedId);
        state.filteredIds = state.filteredIds.filter(id => id !== deletedId);
        
        if (state.selectedProperty?.id === deletedId) {
          state.selectedProperty = null;
        }
        
        state.error = null;
        state.cache.timestamp = Date.now();
        state.cache.needsRefresh = true;
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete property';
      });
  },
});

export const {
  setSelectedProperty,
  setFilter,
  setSearchFilters,
  clearError,
  clearSearchFilters,
  clearProperties,
  invalidateCache,
  updateCache,
} = propertySlice.actions;

export default propertySlice.reducer;
