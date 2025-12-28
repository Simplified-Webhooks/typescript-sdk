import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SimplifiedWebhooks } from '../src/client';
import { AuthenticationError, ValidationError } from '../src/errors';

describe('SimplifiedWebhooks', () => {
  const apiKey = 'test_api_key';
  let client: SimplifiedWebhooks;

  beforeEach(() => {
    client = new SimplifiedWebhooks({ apiKey });
    // Mock global fetch
    global.fetch = vi.fn();
  });

  it('should initialize with an API key', () => {
    expect(() => new SimplifiedWebhooks({ apiKey: '' })).toThrow(AuthenticationError);
  });

  describe('registerWebhook', () => {
    it('should successfully register a webhook', async () => {
      const mockResponse = {
        message: 'Successfully registered',
        webhookId: '123'
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const params = {
        baseId: 'base123',
        tableId: 'table123',
        event: 'record_create' as const,
        webhookUrl: 'https://example.com/hook'
      };

      const result = await client.registerWebhook(params);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/webhooks/register'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(params)
        })
      );
    });

    it('should throw ValidationError on 400 response', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid table ID' }),
      });

      await expect(client.registerWebhook({} as any)).rejects.toThrow(ValidationError);
    });

    it('should throw AuthenticationError on 403 response', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: async () => ({ message: 'Invalid API key' }),
      });

      await expect(client.registerWebhook({} as any)).rejects.toThrow(AuthenticationError);
    });

    it('should throw SimplifiedWebhooksError on network failure', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network failure'));

      await expect(client.registerWebhook({} as any)).rejects.toThrow('Network failure');
    });
  });

  describe('deleteWebhook', () => {
    it('should successfully delete a webhook', async () => {
      const mockResponse = {
        message: 'Successfully deleted',
        webhookId: '123'
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.deleteWebhook('123');

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/webhooks/delete/123'),
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });

    it('should throw NotFoundError on 404 response', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Webhook not found' }),
      });

      await expect(client.deleteWebhook('non-existent')).rejects.toThrow('Webhook not found');
    });
  });
});

