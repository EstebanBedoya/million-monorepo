import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock crypto.randomUUID for Node environments
if (!global.crypto) {
  global.crypto = {};
}
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global i18n mocks to avoid requiring I18nProvider in tests
// NOTE: This mock provides a minimal dictionary used across components
const mockDict = {
  common: {
    loading: 'Loading',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    apply: 'Apply',
    viewDetails: 'View details',
    noResults: "We couldn't find any properties matching your criteria",
    currency: '$',
  },
  header: { title: '', subtitle: '', description: '' },
  footer: { copyright: '' },
  properties: {
    title: 'Properties',
    showing: 'Showing',
    of: 'of',
    properties: 'properties',
    noProperties: 'No Properties Found',
    createProperty: 'Create property',
    editProperty: 'Edit property',
    deleteProperty: 'Delete property',
    propertyDetails: 'Property details',
    backToProperties: 'Back to properties',
    confirmDelete: 'Are you sure?',
    deleteWarning: 'This action cannot be undone',
    deleteSuccess: 'Property deleted',
    createSuccess: 'Property created',
    updateSuccess: 'Property updated',
  },
  filters: {
    title: 'Filters',
    searchLabel: 'Search by name or address',
    searchPlaceholder: 'Search properties...',
    propertyType: 'Filter by property type',
    propertyTypeAll: 'All types',
    propertyTypeHouse: 'House',
    propertyTypeApartment: 'Apartment',
    propertyTypeVilla: 'Villa',
    propertyTypeCondo: 'Condo',
    propertyTypeTownhouse: 'Townhouse',
    propertyTypeStudio: 'Studio',
    priceRange: 'Price Range',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    clearFilters: 'Clear all filters',
    applyFilters: 'Apply filters',
    mobileFilters: 'Filters',
  },
  propertyCard: { bedrooms: 'Bedrooms', bathrooms: 'Bathrooms', area: 'Area', viewDetails: 'View details' },
  propertyDetail: {
    backToProperties: '',
    propertyDetails: '',
    edit: '',
    delete: '',
    price: '',
    location: '',
    propertyType: '',
    propertyId: '',
    additionalInfo: '',
    fullAddress: '',
    propertyCode: '',
    yearBuilt: '',
    ownerInfo: '',
    ownerAddress: '',
    birthday: '',
    transactionHistory: '',
    transactionId: '',
    saleDate: '',
    value: '',
    tax: '',
    associatedName: '',
    quickActions: '',
    editProperty: '',
    deleteProperty: '',
    summary: '',
    status: '',
    active: '',
    owner: '',
    transactions: '',
    na: '',
    ownerId: '',
  },
  propertyForm: {
    createTitle: '',
    editTitle: '',
    basicInformation: '',
    name: '',
    namePlaceholder: '',
    address: '',
    addressPlaceholder: '',
    city: '',
    cityPlaceholder: '',
    price: '',
    pricePlaceholder: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    areaUnit: '',
    areaUnitM2: '',
    areaUnitSqft: '',
    image: '',
    imagePlaceholder: '',
    submit: '',
    cancel: '',
    required: '',
    invalidPrice: '',
    invalidBedrooms: '',
    invalidBathrooms: '',
    invalidArea: '',
    codeInternal: '',
    year: '',
    owner: '',
    selectOwner: '',
    createNewOwner: '',
    images: '',
    addImages: '',
    searchImages: '',
    enableImage: '',
    disableImage: '',
    createError: '',
    updateError: '',
  },
  ownerForm: { createTitle: '', name: '', address: '', photo: '', birthday: '' },
  notFound: { title: '', message: '', backToProperties: '', code: '' },
  errors: { generic: '', network: '', notFound: '', unauthorized: '', server: '', validation: '' },
  pagination: { page: 'Page', of: 'of', previous: 'Previous', next: 'Next', goToPage: 'Go to page' },
  language: { en: 'English', es: 'Spanish', switchLanguage: 'Switch language' },
};

jest.mock('@/i18n/client', () => ({
  useDictionary: () => mockDict,
  useI18n: () => ({ lang: 'en', dict: mockDict }),
  useLocale: () => 'en',
  I18nProvider: ({ children }) => children,
}));