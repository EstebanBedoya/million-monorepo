'use client';

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { Property } from '../../domain/entities/Property';
import { PropertyList } from '../components/PropertyList';
import { NotificationToast } from '../components/NotificationToast';
import { useProperties } from '../hooks/useProperties';
import { setSelectedProperty } from '../../store/slices/propertySlice';

export function PropertiesPage() {
  const dispatch = useAppDispatch();
  const selectedProperty = useAppSelector(state => state.properties.selectedProperty);
  
  const { 
    properties, 
    loading, 
    error, 
    loadProperties, 
    loadAvailableProperties, 
    loadExpensiveProperties 
  } = useProperties();

  const handlePropertyClick = (property: Property) => {
    dispatch(setSelectedProperty(property));
  };

  const handleFilterChange = (filter: string) => {
    switch (filter) {
      case 'all':
        loadProperties();
        break;
      case 'available':
        loadAvailableProperties();
        break;
      case 'expensive':
        loadExpensiveProperties();
        break;
      default:
        loadProperties();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Properties - Redux + Clean Architecture
          </h1>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleFilterChange('all')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              All Properties
            </button>
            <button
              onClick={() => handleFilterChange('available')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Available Only
            </button>
            <button
              onClick={() => handleFilterChange('expensive')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Expensive Properties
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            Error: {error}
          </div>
        )}

        <PropertyList
          properties={properties}
          onPropertyClick={handlePropertyClick}
          loading={loading}
        />

        {selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedProperty.title}
                </h2>
                <button
                  onClick={() => dispatch(setSelectedProperty(null))}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-700">{selectedProperty.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-700">{selectedProperty.location.getFullAddress()}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Price</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedProperty.getFormattedPrice()}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
