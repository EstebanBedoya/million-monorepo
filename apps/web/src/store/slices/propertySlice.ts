import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '../../domain/entities/Property';
import { PropertyService } from '../../application/interfaces/PropertyService';
import { Container } from '../../infrastructure/di/Container';

// Async thunks for property operations
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (options: { page?: number; limit?: number } = {}) => {
    const container = Container.getInstance();
    const propertyService = container.get<PropertyService>('PropertyService');
    return await propertyService.getAllProperties(options.page, options.limit);
  }
);

export const fetchAvailableProperties = createAsyncThunk(
  'properties/fetchAvailableProperties',
  async () => {
    const container = Container.getInstance();
    const propertyService = container.get<PropertyService>('PropertyService');
    return await propertyService.getAvailableProperties();
  }
);

export const fetchExpensiveProperties = createAsyncThunk(
  'properties/fetchExpensiveProperties',
  async () => {
    const container = Container.getInstance();
    const propertyService = container.get<PropertyService>('PropertyService');
    return await propertyService.getExpensiveProperties();
  }
);

export const fetchPropertyById = createAsyncThunk(
  'properties/fetchPropertyById',
  async (id: string) => {
    const container = Container.getInstance();
    const propertyService = container.get<PropertyService>('PropertyService');
    return await propertyService.getProperty(id);
  }
);

export const createProperty = createAsyncThunk(
  'properties/createProperty',
  async (propertyData: any) => {
    const container = Container.getInstance();
    const propertyService = container.get<PropertyService>('PropertyService');
    return await propertyService.createProperty(propertyData);
  }
);

// Property slice state interface
interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  filter: 'all' | 'available' | 'expensive';
}

// Initial state
const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
  pagination: null,
  filter: 'all',
};

// Property slice
const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload;
    },
    setFilter: (state, action: PayloadAction<'all' | 'available' | 'expensive'>) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearProperties: (state) => {
      state.properties = [];
      state.pagination = null;
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
        state.properties = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
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
        state.properties = action.payload;
        state.error = null;
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
        state.properties = action.payload;
        state.error = null;
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
        state.properties.unshift(action.payload); // Add to beginning of array
        state.error = null;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create property';
      });
  },
});

export const {
  setSelectedProperty,
  setFilter,
  clearError,
  clearProperties,
} = propertySlice.actions;

export default propertySlice.reducer;
