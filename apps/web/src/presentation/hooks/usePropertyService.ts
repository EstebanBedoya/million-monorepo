'use client';

import { useState, useCallback } from 'react';
import { PropertyServiceClient, PropertyFilters, PropertyResponse } from '../../application/services/PropertyServiceClient';
import { MockPropertyType } from '../../domain/schemas/property.schema';

export interface UsePropertyServiceOptions {
  baseUrl?: string;
  simulateErrors?: boolean;
  errorRate?: number;
}

export interface UsePropertyServiceReturn {
  properties: MockPropertyType[];
  pagination: PropertyResponse['pagination'] | null;
  loading: boolean;
  error: Error | string | null;
  fetchProperties: (filters?: PropertyFilters, page?: number) => Promise<void>;
  retry: () => void;
  clearError: () => void;
  setErrorSimulation: (enabled: boolean, errorRate?: number) => void;
}

export function usePropertyService(options: UsePropertyServiceOptions = {}): UsePropertyServiceReturn {
  const [properties, setProperties] = useState<MockPropertyType[]>([]);
  const [pagination, setPagination] = useState<PropertyResponse['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | string | null>(null);
  const [lastFilters, setLastFilters] = useState<PropertyFilters>({});
  const [lastPage, setLastPage] = useState(1);

  // Create service instance
  const service = new PropertyServiceClient({
    baseUrl: options.baseUrl || '/api/mock/properties',
    simulateErrors: options.simulateErrors || false,
    errorRate: options.errorRate || 0.1,
  });

  const fetchProperties = useCallback(async (filters: PropertyFilters = {}, page: number = 1) => {
    setLoading(true);
    setError(null);
    setLastFilters(filters);
    setLastPage(page);

    try {
      const response = await service.getProperties(filters, { page, limit: 12 });
      setProperties(response.properties);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : String(err);
      setError(errorMessage);
      setProperties([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [service]);

  const retry = useCallback(() => {
    fetchProperties(lastFilters, lastPage);
  }, [fetchProperties, lastFilters, lastPage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setErrorSimulation = useCallback((enabled: boolean, errorRate: number = 0.1) => {
    service.setErrorSimulation(enabled, errorRate);
  }, [service]);

  return {
    properties,
    pagination,
    loading,
    error,
    fetchProperties,
    retry,
    clearError,
    setErrorSimulation,
  };
}
