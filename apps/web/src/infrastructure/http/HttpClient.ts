import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipLogging?: boolean;
  retry?: boolean;
  retryCount?: number;
  metadata?: {
    requestId: string;
    timestamp: number;
  };
}

// Extend AxiosRequestConfig to include our custom properties
declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
    skipLogging?: boolean;
    retry?: boolean;
    retryCount?: number;
    metadata?: {
      requestId: string;
      timestamp: number;
    };
  }
}

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token && !config.skipAuth) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.metadata = {
          requestId: this.generateRequestId(),
          timestamp: Date.now(),
        };

        // Log request
        if (!config.skipLogging) {
          console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`, {
            requestId: config.metadata.requestId,
            headers: config.headers,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('[HTTP Request Error]', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful response
        if (!response.config.skipLogging) {
          console.log(`[HTTP Response] ${response.status} ${response.config.url}`, {
            requestId: response.config.metadata?.requestId,
            data: response.data,
            duration: Date.now() - (response.config.metadata?.timestamp || 0),
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as RequestConfig;

        // Handle retries
        if (this.shouldRetry(error, originalRequest)) {
          return this.retryRequest(originalRequest);
        }

        // Log error
        if (!originalRequest?.skipLogging) {
          console.error('[HTTP Error]', {
            requestId: originalRequest?.metadata?.requestId,
            error: error.message,
            status: error.response?.status,
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: AxiosError, config: RequestConfig): boolean {
    if (!config?.retry) return false;
    if ((config.retryCount || 0) >= this.config.retries) return false;
    
    // Retry on network errors or 5xx errors
    return (
      !error.response || 
      (error.response.status >= 500 && error.response.status < 600)
    );
  }

  private async retryRequest(config: RequestConfig): Promise<AxiosResponse> {
    config.retryCount = (config.retryCount || 0) + 1;
    
    // Exponential backoff
    const delay = this.config.retryDelay * Math.pow(2, (config.retryCount || 1) - 1);
    await this.sleep(delay);

    console.log(`[HTTP Retry] Attempt ${config.retryCount}/${this.config.retries} for ${config.url}`);
    
    return this.axiosInstance.request(config);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods
  async get<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  // Method to update auth token
  setAuthToken(token: string | null): void {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Method to clear auth token
  clearAuthToken(): void {
    localStorage.removeItem('auth_token');
  }
}
