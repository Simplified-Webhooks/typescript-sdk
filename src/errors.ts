export class SimplifiedWebhooksError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public path?: string
  ) {
    super(message);
    this.name = 'SimplifiedWebhooksError';
  }
}

export class AuthenticationError extends SimplifiedWebhooksError {
  constructor(message = 'Invalid or missing API key') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends SimplifiedWebhooksError {
  constructor(message: string, path?: string) {
    super(message, 404, 'NOT_FOUND', path);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends SimplifiedWebhooksError {
  constructor(message: string, path?: string) {
    super(message, 400, 'BAD_REQUEST', path);
    this.name = 'ValidationError';
  }
}

