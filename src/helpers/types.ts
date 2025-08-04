export type ErrorLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
}

export interface ConversionError {
  message: string;
  context: string;
  timestamp: string;
  type: 'error' | 'warning' | 'unknown';
  level: ErrorLevel;
  stack?: string;
  count: number;
}

export interface ConversionResult {
  success: boolean;
  message: string;
  error?: ConversionError;
}

// 自定义错误类型
export class FileConversionError extends Error {
  constructor(
    message: string,
    public context: string,
    public level: ErrorLevel = 'error'
  ) {
    super(message);
    this.name = 'FileConversionError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public context: string,
    public level: ErrorLevel = 'warning'
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
