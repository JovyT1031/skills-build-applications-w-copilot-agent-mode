// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createApp } from './server';

async function withTestServer(handler: (baseUrl: string) => Promise<void>) {
  const app = createApp();
  const server = createServer(app);

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(undefined));
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Server address is unavailable');
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    await handler(baseUrl);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve(undefined)));
    });
  }
}

test('health endpoint responds with service metadata', async () => {
  await withTestServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`);
    assert.equal(response.status, 200);

    const body = await response.json();
    assert.equal(body.service, 'octofit-backend');
    assert.equal(body.status, 'ok');
  });
});

test('health endpoint uses the Codespaces base URL when configured', async () => {
  const previousCodespaceName = process.env.CODESPACE_NAME;
  process.env.CODESPACE_NAME = 'octofit-demo';

  try {
    await withTestServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/health`);
      assert.equal(response.status, 200);

      const body = await response.json();
      assert.equal(body.apiUrl, 'https://octofit-demo-8000.app.github.dev');
    });
  } finally {
    if (previousCodespaceName === undefined) {
      delete process.env.CODESPACE_NAME;
    } else {
      process.env.CODESPACE_NAME = previousCodespaceName;
    }
  }
});

test('users endpoint returns a populated payload', async () => {
  await withTestServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/users/`);
    assert.equal(response.status, 200);

    const body = await response.json();
    assert.equal(body.count, 2);
    assert.ok(Array.isArray(body.users));
  });
});
