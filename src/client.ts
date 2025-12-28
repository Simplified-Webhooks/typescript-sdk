import { 
  SimplifiedWebhooksConfig, 
  WebhookRegistration, 
  WebhookResponse,
  ApiErrorResponse 
} from './types';
import { 
  SimplifiedWebhooksError, 
  AuthenticationError, 
  NotFoundError, 
  ValidationError 
} from './errors';

const DEFAULT_BASE_URL = 'https://api.simplified-webhooks.com';

export class SimplifiedWebhooks {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: SimplifiedWebhooksConfig) {
    if (!config.apiKey) {
      throw new AuthenticationError('API key is required');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl?.replace(/\/$/, '') || DEFAULT_BASE_URL;
  }

  /**
   * Register a new webhook for specific events on Airtable.
   */
  async registerWebhook(params: WebhookRegistration): Promise<WebhookResponse> {
    return this.request<WebhookResponse>('/webhooks/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Delete an existing webhook by its ID.
   */
  async deleteWebhook(webhookId: string): Promise<WebhookResponse> {
    return this.request<WebhookResponse>(`/webhooks/delete/${webhookId}`, {
      method: 'DELETE',
    });
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof SimplifiedWebhooksError) {
        throw error;
      }
      throw new SimplifiedWebhooksError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: Partial<ApiErrorResponse> = {};
    try {
      errorData = await response.json();
    } catch {
      // Ignore JSON parsing errors for error responses
    }

    const message = errorData.message || response.statusText;
    const status = response.status;
    const path = errorData.path;

    switch (status) {
      case 400:
        throw new ValidationError(message, path);
      case 403:
        throw new AuthenticationError(message);
      case 404:
        throw new NotFoundError(message, path);
      case 422:
        throw new ValidationError(message, path);
      default:
        throw new SimplifiedWebhooksError(message, status, undefined, path);
    }
  }
}

