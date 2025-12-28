# Simplified Webhooks SDK

The official TypeScript SDK for [Simplified Webhooks](https://www.simplified-webhooks.com).

## Installation

```bash
npm install @simplified-webhooks/sdk
# or
yarn add @simplified-webhooks/sdk
# or
pnpm add @simplified-webhooks/sdk
```

## Usage

### Initialize the Client

```typescript
import { SimplifiedWebhooks } from '@simplified-webhooks/sdk';

const sw = new SimplifiedWebhooks({
  apiKey: 'your_api_key_here'
});
```

### Register a Webhook

```typescript
try {
  const result = await sw.registerWebhook({
    baseId: 'appkGlXEiufQLn1Qd',
    tableId: 'tblMHdKX6vN1Eci9x',
    event: 'record_create',
    webhookUrl: 'https://your-server.com/webhook'
  });

  console.log('Registered:', result.webhookId);
} catch (error) {
  console.error('Failed to register:', error.message);
}
```

### Delete a Webhook

```typescript
try {
  const result = await sw.deleteWebhook('20c775ff-666c-42d7-b4db-26e4af4e43c7');
  console.log('Deleted:', result.webhookId);
} catch (error) {
  console.error('Failed to delete:', error.message);
}
```

## API Reference

### `SimplifiedWebhooks`

#### `constructor(config: SimplifiedWebhooksConfig)`
- `apiKey`: Your API key.
- `baseUrl`: (Optional) Override the default API URL.

#### `registerWebhook(params: WebhookRegistration)`
Registers a new airtable webhook.
- `baseId`: Airtable Base ID.
- `tableId`: Airtable Table ID.
- `event`: `'record_create' | 'record_update' | 'record_delete'`.
- `webhookUrl`: The destination URL for notifications.
- `columnId`: (Optional) Array of field IDs to watch (only for `record_update`).

#### `deleteWebhook(webhookId: string)`
Deletes a webhook by ID.

## Error Handling

The SDK throws specific error classes for better error management:
- `AuthenticationError` (403)
- `ValidationError` (400, 422)
- `NotFoundError` (404)
- `SimplifiedWebhooksError` (Generic)

```typescript
import { AuthenticationError } from '@simplified-webhooks/sdk';

try {
  await sw.registerWebhook(...);
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle auth error
  }
}
```

## License

MIT

## Development

### Running Tests

```bash
# Run unit tests
npm test

# Run integration tests (requires a real API key)
SW_TEST_API_KEY=your_key_here npm run test:integration
```

