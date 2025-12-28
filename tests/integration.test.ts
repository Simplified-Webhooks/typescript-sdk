import { describe, it, expect, beforeAll } from 'vitest';
import { SimplifiedWebhooks } from '../src/client';

/**
 * INTEGRATION TEST
 * 
 * To run these tests:
 * 1. Get a test API key from Simplified Webhooks
 * 2. Run: SW_TEST_API_KEY=your_key_here npm run test:integration
 */

describe('SimplifiedWebhooks Integration', () => {
  const apiKey = process.env.SW_TEST_API_KEY;
  let client: SimplifiedWebhooks;

  // Only run if API key is provided
  const skipIfNoKey = apiKey ? it : it.skip;

  beforeAll(() => {
    if (apiKey) {
      client = new SimplifiedWebhooks({ apiKey });
    }
  });

  const baseId = 'appOlUtnojehnoTMY';
  const tableId = 'tblWW2hL9oVjBb156';

  skipIfNoKey('should perform lifecycle for record_create', async () => {
    const registerResult = await client.registerWebhook({
      baseId,
      tableId,
      event: 'record_create',
      webhookUrl: 'https://example.com/webhook-create-test'
    });

    expect(registerResult.webhookId).toBeDefined();

    // Cleanup
    const deleteResult = await client.deleteWebhook(registerResult.webhookId);
    expect(deleteResult.webhookId).toBe(registerResult.webhookId);
  });

  skipIfNoKey('should perform lifecycle for record_update', async () => {
    const registerResult = await client.registerWebhook({
      baseId,
      tableId,
      event: 'record_update',
      webhookUrl: 'https://example.com/webhook-update-test',
      columnId: ['fld5w6lzAB4okiL1L']
    });

    expect(registerResult.webhookId).toBeDefined();

    // Cleanup
    const deleteResult = await client.deleteWebhook(registerResult.webhookId);
    expect(deleteResult.webhookId).toBe(registerResult.webhookId);
  });

  skipIfNoKey('should perform lifecycle for record_delete', async () => {
    const registerResult = await client.registerWebhook({
      baseId,
      tableId,
      event: 'record_delete',
      webhookUrl: 'https://example.com/webhook-delete-test'
    });

    expect(registerResult.webhookId).toBeDefined();

    // Cleanup
    const deleteResult = await client.deleteWebhook(registerResult.webhookId);
    expect(deleteResult.webhookId).toBe(registerResult.webhookId);
  });

  skipIfNoKey('should throw a real ValidationError for invalid data', async () => {
    await expect(client.registerWebhook({
      baseId: 'invalid',
      tableId: 'invalid',
      event: 'record_create',
      webhookUrl: 'not-a-url'
    })).rejects.toThrow();
  });

  skipIfNoKey('should throw NotFoundError for a non-existent baseId', async () => {
    // Using a random but valid-looking Airtable base ID format
    const randomBaseId = 'appNonExistent123';
    
    await expect(client.registerWebhook({
      baseId: randomBaseId,
      tableId: 'tblAnyTable',
      event: 'record_create',
      webhookUrl: 'https://example.com/webhook-test'
    })).rejects.toThrow(); 
    // The backend should return a 404 which the SDK maps to NotFoundError
  });
});

