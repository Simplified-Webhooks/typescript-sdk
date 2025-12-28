export type WebhookEvent = 'record_update' | 'record_create' | 'record_delete';

export interface WebhookRegistration {
  /** The ID of the Airtable base. */
  baseId: string;
  /** The ID of the Airtable table. */
  tableId: string;
  /** The type of event to subscribe to. */
  event: WebhookEvent;
  /** The URL to which the webhook notifications will be sent. */
  webhookUrl: string;
  /** 
   * An array of column IDs to watch for updates. 
   * This field is only applicable for the 'record_update' event. 
   */
  columnId?: string[];
}

export interface WebhookResponse {
  message: string;
  webhookId: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface SimplifiedWebhooksConfig {
  /** Your API key for authentication. */
  apiKey: string;
  /** Optional base URL for the API. Defaults to https://api.simplified-webhooks.com */
  baseUrl?: string;
}

