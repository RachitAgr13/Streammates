export interface HealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
  uptime: number;
  database: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
