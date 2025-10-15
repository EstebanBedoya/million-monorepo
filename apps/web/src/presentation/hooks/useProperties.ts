'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchProperties, 
  fetchAvailableProperties, 
  fetchExpensiveProperties,
  setFilter 
} from '../../store/slices/propertySlice';
import { 
  selectProperties, 
  selectPropertiesLoading, 
  selectPropertiesError,
  selectFilteredProperties 
} from '../../store/selectors/propertySelectors';

export function useProperties() {
  const dispatch = useAppDispatch();
  const properties = useAppSelector(selectFilteredProperties);
  const loading = useAppSelector(selectPropertiesLoading);
  const error = useAppSelector(selectPropertiesError);

  useEffect(() => {
    dispatch(fetchProperties({ page: 1, limit: 10 }));
  }, [dispatch]);

  const loadProperties = () => {
    dispatch(fetchProperties({ page: 1, limit: 10 }));
    dispatch(setFilter('all'));
  };

  const loadAvailableProperties = () => {
    dispatch(fetchAvailableProperties());
    dispatch(setFilter('available'));
  };

  const loadExpensiveProperties = () => {
    dispatch(fetchExpensiveProperties());
    dispatch(setFilter('expensive'));
  };

  return {
    properties,
    loading,
    error,
    loadProperties,
    loadAvailableProperties,
    loadExpensiveProperties,
    refetch: loadProperties
  };
}
