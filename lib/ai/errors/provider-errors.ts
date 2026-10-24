export type AIErrorCode = 'INVALID_REQUEST' | 'UNAUTHORIZED' | 'AI_CREDITS_EXHAUSTED' | 'RATE_LIMIT_EXCEEDED' | 'PROVIDER_OUTAGE' | 'MALFORMED_OUTPUT' | 'STRUCTURAL_MISMATCH' | 'UNKNOWN_ERROR';

export class AIProviderError extends Error {
  public readonly code: AIErrorCode;
  public readonly statusCode: number;

  constructor(code: AIErrorCode, message: string, statusCode: number = 500) {
    super(message);
    this.name = 'AIProviderError';
    this.code = code;
    this.statusCode = statusCode;
  }
}
