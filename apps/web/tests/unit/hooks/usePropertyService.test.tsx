import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { usePropertyService } from '../../../src/presentation/hooks/usePropertyService';

// Mock the PropertyServiceClient
jest.mock('../../../src/application/services/PropertyServiceClient', () => {
  return {
    PropertyServiceClient: jest.fn().mockImplementation(() => ({
      getProperties: jest.fn(),
      setErrorSimulation: jest.fn(),
      setErrorTypes: jest.fn(),
    })),
  };
});

describe('usePropertyService', () => {
  const mockGetProperties = jest.fn();
  const mockSetErrorSimulation = jest.fn();
  const mockSetErrorTypes = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the mock implementation
    const { PropertyServiceClient } = require('../../../src/application/services/PropertyServiceClient');
    PropertyServiceClient.mockImplementation(() => ({
      getProperties: mockGetProperties,
      setErrorSimulation: mockSetErrorSimulation,
      setErrorTypes: mockSetErrorTypes,
    }));
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePropertyService());

    expect(result.current.properties).toEqual([]);
    expect(result.current.pagination).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch properties successfully', async () => {
    const mockResponse = {
      properties: [{ id: '1', name: 'Test Property' }],
      pagination: {
        page: 1,
        limit: 12,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };

    mockGetProperties.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => usePropertyService());

    await act(async () => {
      await result.current.fetchProperties({ search: 'test' }, 1);
    });

    expect(result.current.properties).toEqual(mockResponse.properties);
    expect(result.current.pagination).toEqual(mockResponse.pagination);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    const error = new Error('Network error');
    mockGetProperties.mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePropertyService());

    await act(async () => {
      await result.current.fetchProperties();
    });

    expect(result.current.properties).toEqual([]);
    expect(result.current.pagination).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network error');
  });

  it('should set loading state during fetch', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockGetProperties.mockReturnValueOnce(promise);

    const { result } = renderHook(() => usePropertyService());

    act(() => {
      result.current.fetchProperties();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({ properties: [], pagination: {} });
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('should retry with last filters and page', async () => {
    const mockResponse = { properties: [], pagination: {} };
    mockGetProperties.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePropertyService());

    // First fetch
    await act(async () => {
      await result.current.fetchProperties({ search: 'test' }, 2);
    });

    // Retry
    await act(async () => {
      result.current.retry();
    });

    expect(mockGetProperties).toHaveBeenCalledTimes(2);
    expect(mockGetProperties).toHaveBeenLastCalledWith({ search: 'test' }, { page: 2, limit: 12 });
  });

  it('should clear error', () => {
    const { result } = renderHook(() => usePropertyService());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should set error simulation', () => {
    const { result } = renderHook(() => usePropertyService());

    act(() => {
      result.current.setErrorSimulation(true, 0.5);
    });

    expect(mockSetErrorSimulation).toHaveBeenCalledWith(true, 0.5);
  });

  it('should use custom configuration', () => {
    const customConfig = {
      baseUrl: 'http://custom-api.com',
      simulateErrors: true,
      errorRate: 0.2,
    };

    renderHook(() => usePropertyService(customConfig));

    // The service should be created with custom config
    expect(mockSetErrorSimulation).toHaveBeenCalledWith(true, 0.2);
  });
});
