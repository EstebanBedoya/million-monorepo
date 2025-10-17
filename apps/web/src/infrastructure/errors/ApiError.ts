/**
 * Custom error classes for API operations
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    status: number = 500,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static fromAxiosError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'response' in error) {
      // Server responded with error status
      const axiosError = error as { response: { status: number; data: { message?: string; code?: string } } };
      const { status, data } = axiosError.response;
      return new ApiError(
        data?.message || `HTTP ${status} Error`,
        status,
        data?.code,
        data
      );
    } else if (error && typeof error === 'object' && 'request' in error) {
      // Network error
      return new ApiError('Network error - please check your connection', 0, 'NETWORK_ERROR');
    } else {
      // Request setup error
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : 'Request failed';
      return new ApiError(errorMessage);
    }
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network error') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ApiError {
  public readonly validationErrors: Record<string, string[]>;

  constructor(
    message: string = 'Validation failed',
    validationErrors: Record<string, string[]> = {}
  ) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
}
