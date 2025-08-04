import { ConversionError, ErrorLevel, RetryConfig } from './types';

export class ErrorHandler {
  private static errorStats = new Map<string, number>();
  private static maxRetries = 3;
  private static retryDelay = 1000; // 1秒

  static handleError(error: unknown, context: string, level: ErrorLevel = 'error'): ConversionError {
    // 更新错误统计
    const errorKey = `${context}:${level}`;
    this.errorStats.set(errorKey, (this.errorStats.get(errorKey) || 0) + 1);

    if (error instanceof Error) {
      return {
        message: error.message,
        context,
        timestamp: new Date().toISOString(),
        type: 'error',
        level,
        stack: error.stack,
        count: this.errorStats.get(errorKey) || 1
      };
    }
    return {
      message: String(error),
      context,
      timestamp: new Date().toISOString(),
      type: 'unknown',
      level,
      count: this.errorStats.get(errorKey) || 1
    };
  }

  static logError(error: ConversionError): void {
    const prefix = `[${error.timestamp}] ${error.level.toUpperCase()} in ${error.context}`;
    const details = `(发生次数: ${error.count})`;
    console.error(`${prefix}: ${error.message} ${details}`);
    
    if (error.stack) {
      console.error('错误堆栈:', error.stack);
    }
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig = {}
  ): Promise<T> {
    const maxAttempts = config.maxRetries || this.maxRetries;
    const delay = config.retryDelay || this.retryDelay;
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxAttempts) {
          console.warn(`操作失败，第 ${attempt} 次重试...`);
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }

    throw new Error(`操作在 ${maxAttempts} 次尝试后失败: ${lastError?.message}`);
  }

  static getErrorStats(): Map<string, number> {
    return new Map(this.errorStats);
  }

  static clearErrorStats(): void {
    this.errorStats.clear();
  }

  static isRecoverableError(error: unknown): boolean {
    // 判断错误是否可恢复
    if (error instanceof Error) {
      const nonRecoverableErrors = ['EACCES', 'ENOENT', 'ENOTFOUND'];
      // @ts-ignore
      return !nonRecoverableErrors.includes(error.code);
    }
    return true;
  }
}
